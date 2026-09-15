<?php

namespace App\Command;

use App\Entity\Product;
use App\Service\ProductApiClient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:import-products',
    description: 'Importe le catalogue vêtements depuis l\'API produits',
)]
class ImportProductsCommand extends Command
{
    // Slug de l'API -> (Genre, Catégorie, Sous-catégorie)
    private const CATEGORY_MAP = [
        'mens-shirts'      => ['Homme', 'Vêtements',   'Chemises'],
        'mens-shoes'       => ['Homme', 'Chaussures',  'Chaussures'],
        'womens-dresses'   => ['Femme', 'Vêtements',   'Robes'],
        'womens-shoes'     => ['Femme', 'Chaussures',  'Chaussures'],
        'womens-bags'      => ['Femme', 'Accessoires', 'Sacs'],
        'womens-jewellery' => ['Femme', 'Accessoires', 'Bijoux'],
        'tops'             => ['Femme', 'Vêtements',   'Hauts'],
        'sunglasses'       => ['Mixte', 'Accessoires', 'Lunettes de soleil'],
    ];

    // Tags de l'API -> type de produit affiché
    private const TYPE_MAP = [
        'footwear'            => 'Chaussures',
        'fashion accessories' => 'Accessoires de mode',
        'dresses'             => 'Robes',
        "girls' dresses"      => 'Robes',
        'gowns'               => 'Robes de soirée',
        'eyewear'             => 'Lunettes',
        "men's shirts"        => 'Chemises',
        "men's t-shirts"      => 'T-shirts',
        'corsets'             => 'Corsets',
        'suits'               => 'Costumes',
        'bags'                => 'Sacs',
        'jewellery'           => 'Bijoux',
        'watches'             => 'Montres',
        'tops'                => 'Hauts',
    ];

    // Mot anglais du titre -> couleur affichée. L'ordre compte : première correspondance retenue.
    private const COLOURS = [
        'Black' => 'Noir', 'White' => 'Blanc', 'Blue' => 'Bleu', 'Red' => 'Rouge',
        'Green' => 'Vert', 'Yellow' => 'Jaune', 'Pink' => 'Rose', 'Purple' => 'Violet',
        'Brown' => 'Marron', 'Grey' => 'Gris', 'Gray' => 'Gris', 'Beige' => 'Beige',
        'Navy' => 'Bleu marine', 'Orange' => 'Orange', 'Silver' => 'Argent',
        'Golden' => 'Doré', 'Gold' => 'Doré',
    ];

    // Mots-clés du titre ou des tags -> valeur du filtre « Utilisation »
    private const USAGE_RULES = [
        'Habillé'     => ['gown', 'formal', 'dress shirt', 'suit', 'elegant', 'evening'],
        'Sport'       => ['sport', 'running', 'training', 'athletic', 'sneaker'],
        'Décontracté' => ['casual', 't-shirt', 'tee', 'denim', 'jeans'],
    ];

    public function __construct(
        private readonly ProductApiClient $productApi,
        private readonly HttpClientInterface $httpClient,
        private readonly EntityManagerInterface $entityManager,
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'keep',
            null,
            InputOption::VALUE_NONE,
            'Conserve les produits existants au lieu de vider la table'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Import du catalogue vêtements');

        if (!$input->getOption('keep')) {
            $this->entityManager->createQuery('DELETE FROM App\Entity\Product')->execute();
            $io->note('Produits existants supprimés.');
        }

        $imported = 0;
        $skipped = 0;

        foreach ($this->productApi->getClothingCategories() as $category) {
            $products = $this->productApi->getProductsByCategory($category);

            if ([] === $products) {
                $io->warning(sprintf('Aucun produit pour « %s »', $category));
                continue;
            }

            foreach ($products as $data) {
                if ($this->importProduct($data, $category)) {
                    ++$imported;
                } else {
                    ++$skipped;
                }
            }

            $this->entityManager->flush();
            $io->text(sprintf('  %-18s %d produits', $category, count($products)));
        }

        if (0 === $imported) {
            $io->error('Aucun produit importé : l\'API est-elle joignable ?');

            return Command::FAILURE;
        }

        $io->success(sprintf('%d produits importés, %d ignorés.', $imported, $skipped));

        return Command::SUCCESS;
    }

    private function importProduct(array $data, string $category): bool
    {
        if (empty($data['title']) || !isset($data['price'])) {
            return false;
        }

        [$gender, $mainCategory, $subCategory] = self::CATEGORY_MAP[$category]
            ?? ['Mixte', 'Vêtements', ucfirst($category)];

        $title = (string) $data['title'];
        $tags = array_map('strval', $data['tags'] ?? []);

        $product = new Product();
        $product->setProductId((int) $data['id']);
        $product->setProductTitle(substr($title, 0, 999));
        $product->setPrice((float) $data['price']);
        $product->setGender($gender);
        $product->setCategory($mainCategory);
        $product->setSubCategory($subCategory);
        $product->setProductType($this->productType($tags, $subCategory));
        $product->setColour($this->colour($title));
        $product->setProductUsage($this->usage($title, $tags));

        $imageUrl = $data['thumbnail'] ?? ($data['images'][0] ?? null);
        if ($imageUrl) {
            $localPath = $this->downloadWebp($imageUrl);
            $product->setImageURL($localPath ?? $imageUrl);
            $product->setCategoryImage($localPath ?? $imageUrl);
        }

        $this->entityManager->persist($product);

        return true;
    }

    private function productType(array $tags, string $subCategory): string
    {
        foreach ($tags as $tag) {
            $type = self::TYPE_MAP[strtolower($tag)] ?? null;
            if (null !== $type) {
                return $type;
            }
        }

        return $subCategory;
    }

    private function colour(string $title): ?string
    {
        foreach (self::COLOURS as $word => $colour) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $title)) {
                return $colour;
            }
        }

        return null;
    }

    private function usage(string $title, array $tags): string
    {
        $haystack = strtolower($title . ' ' . implode(' ', $tags));

        foreach (self::USAGE_RULES as $usage => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($haystack, $keyword)) {
                    return $usage;
                }
            }
        }

        return 'Quotidien';
    }

    // Télécharge l'image, la convertit en WebP et la déduplique par hash d'URL
    private function downloadWebp(string $imgUrl): ?string
    {
        $filename = md5($imgUrl) . '.webp';
        $localPath = '/uploads/' . $filename;
        $absolutePath = $this->projectDir . '/public' . $localPath;

        if (file_exists($absolutePath)) {
            return $localPath;
        }

        try {
            $imageData = $this->httpClient->request('GET', $imgUrl)->getContent();
        } catch (\Throwable) {
            return null;
        }

        $imageInfo = getimagesizefromstring($imageData);
        if (!$imageInfo) {
            return null;
        }

        // Source déjà en WebP : on l'écrit telle quelle, réencoder dégraderait pour rien
        if ('image/webp' === $imageInfo['mime']) {
            return false === file_put_contents($absolutePath, $imageData) ? null : $localPath;
        }

        $gdImage = match ($imageInfo['mime']) {
            'image/jpeg', 'image/png' => imagecreatefromstring($imageData),
            default => null,
        };

        if (!$gdImage) {
            return null;
        }

        imagewebp($gdImage, $absolutePath, 80);
        imagedestroy($gdImage);

        return $localPath;
    }
}
