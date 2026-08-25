<?php

namespace App\Command;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:import-products',
    description: 'Imports products from Platzi fake API into the database',
)]
class ImportFakeProductsCommand extends Command
{
    public function __construct(
        private HttpClientInterface $httpClient,
        private EntityManagerInterface $entityManager,
        #[Autowire('%kernel.project_dir%')]
        private string $projectDir
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Importing products from multiple sources...');

        try {
            // Clear existing to ensure a clean "25+" state as requested
            $this->entityManager->createQuery('DELETE FROM App\Entity\Product')->execute();
            $io->note('Existing products cleared.');

            $count = 0;

            // --- SOURCE 1: PLATZI API ---
            $io->section('Source: Platzi API');

            // We'll fetch from categories first as it sometimes reveals more items
            $catResponse = $this->httpClient->request('GET', "https://api.escuelajs.co/api/v1/categories");
            $categories = $catResponse->toArray();

            $seenPlatziIds = [];

            foreach ($categories as $cat) {
                if ($cat['id'] > 100) continue; // Skip test categories

                $io->comment(sprintf('Fetching products for category: %s', $cat['name']));
                $response = $this->httpClient->request('GET', "https://api.escuelajs.co/api/v1/categories/{$cat['id']}/products");
                $productsData = $response->toArray();

                foreach ($productsData as $data) {
                    if (in_array($data['id'], $seenPlatziIds)) continue;
                    $seenPlatziIds[] = $data['id'];

                    if ($this->importPlatziProduct($data, $io)) {
                        $count++;
                        if ($count % 5 === 0) $io->write('.');
                    }
                }
                $this->entityManager->flush();
            }

            // --- SOURCE 2: FAKESTORE API ---
            $io->newLine(2);
            $io->section('Source: FakeStoreAPI');

            $response = $this->httpClient->request('GET', "https://fakestoreapi.com/products");
            $fsData = $response->toArray();

            foreach ($fsData as $data) {
                if ($this->importFakeStoreProduct($data, $io)) {
                    $count++;
                    $io->write('+');
                }
            }
            $this->entityManager->flush();

            $io->newLine(2);
            $io->success(sprintf('Successfully imported %d products in total!', $count));

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error('Failed to import products: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    private function downloadWebp(string $imgUrl): ?string
    {
        $filename = md5($imgUrl) . '.webp';
        $localPath = '/uploads/' . $filename;
        $absolutePath = $this->projectDir . '/public' . $localPath;

        if (file_exists($absolutePath)) {
            return $localPath;
        }

        try {
            $response = $this->httpClient->request('GET', $imgUrl);
            $imageData = $response->getContent();
        } catch (\Exception $e) {
            error_log('downloadWebp a échoué ' . $imgUrl . ': ' . $e->getMessage());
            return null;
        }

        $imageInfo = getimagesizefromstring($imageData);

        if (!$imageInfo) {
            return null;
        }

        $mimeType = $imageInfo['mime'];

        $gdImage = match ($mimeType) {
            'image/jpeg' => imagecreatefromstring($imageData),
            'image/png' => imagecreatefromstring($imageData),
            default => null
        };

        if (!$gdImage) {
            return null;
        }

        imagewebp($gdImage, $absolutePath, 80);

        return $localPath;
    }

    private function importPlatziProduct(array $data, SymfonyStyle $io): bool
    {
        try {
            // Essential validation
            if (empty($data['title']) || !isset($data['price'])) return false;

            $product = new Product();
            $product->setProductTitle(substr($data['title'], 0, 999));
            $product->setPrice((float)$data['price']);
            $product->setProductId((int)$data['id']);

            $categoryName = $data['category']['name'] ?? 'General';
            $product->setCategory($categoryName);

            // Category image
            $catImage = $data['category']['image'] ?? null;
            if ($catImage) $product->setCategoryImage($catImage);

            if (isset($data['description'])) {
                $product->setProductUsage(substr($data['description'], 0, 1999));
            }

            // Parse images
            $images = $data['images'] ?? [];
            $imgUrl = $this->parsePlatziImage($images);

            // FALLBACK: If image is a placeholder or missing, use category image
            if (!$imgUrl || str_contains($imgUrl, 'placehold.co') || str_contains($imgUrl, 'placeimg.com') || str_contains($imgUrl, 'picsum.photos')) {
                if ($catImage && !str_contains($catImage, 'place')) {
                    $imgUrl = $catImage;
                }
            }

            $webpPath = $imgUrl ? $this->downloadWebp($imgUrl) : null;
            $product->setImageURL($webpPath ?? $imgUrl);

            $this->entityManager->persist($product);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function importFakeStoreProduct(array $data, SymfonyStyle $io): bool
    {
        try {
            $product = new Product();
            $product->setProductTitle(substr($data['title'], 0, 999));
            $product->setPrice((float)$data['price']);
            // offset FakeStore IDs to avoid conflict with Platzi
            $product->setProductId((int)$data['id'] + 10000);

            $product->setCategory(ucfirst($data['category'] ?? 'General'));

            if (isset($data['description'])) {
                $product->setProductUsage(substr($data['description'], 0, 1999));
            }

            $imgUrl = $data['image'] ?? null;
            $webpPath = $imgUrl ? $this->downloadWebp($imgUrl) : null;
            $product->setImageURL($webpPath ?? $imgUrl);
            $product->setCategoryImage($webpPath ?? $imgUrl);

            $this->entityManager->persist($product);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function parsePlatziImage(array $images): ?string
    {
        if (empty($images)) return null;

        $imgUrl = $images[0];

        if (is_string($imgUrl)) {
            // Handle double/triple JSON encoding
            while ((str_starts_with($imgUrl, '["') || str_starts_with($imgUrl, '[')) && strlen($imgUrl) > 5) {
                $parsed = json_decode($imgUrl, true);
                if (is_array($parsed) && count($parsed) > 0) {
                    $imgUrl = $parsed[0];
                } else {
                    break;
                }
            }
            return trim($imgUrl, '[]"\n\r ');
        }

        return null;
    }
}
