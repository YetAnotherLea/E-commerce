<?php

namespace App\Controller;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
#[Route('/api/admin/products')]
class AdminProductController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('', name: 'admin_products_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $products = $this->entityManager->getRepository(Product::class)->findAll();

        $productsArray = [];
        foreach ($products as $product) {
            $productsArray[] = [
                'id' => $product->getId(), // ID-ul din baza de date (utile pour les mises a jour)
                '_id' => $product->get_id(),
                'ProductTitle' => $product->getProductTitle(),
                'Price' => $product->getPrice(),
                'Category' => $product->getCategory(),
                'ProductType' => $product->getProductType(),
                'Colour' => $product->getColour(),
                'ImageURL' => $product->getImageURL(),
                'Gender' => $product->getGender(),
                'SubCategory' => $product->getSubCategory(),
                'ProductUsage' => $product->getProductUsage(),
            ];
        }

        return $this->json($productsArray);
    }

    #[Route('', name: 'admin_products_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['ProductTitle']) || !isset($data['Price'])) {
            return $this->json(['message' => 'Missing required fields: ProductTitle and Price are mandatory.'], Response::HTTP_BAD_REQUEST);
        }

        $product = new Product();
        $product->setProductTitle($data['ProductTitle'] ?? null);
        $product->setPrice($data['Price'] ?? 0.0);
        $product->set_id($data['_id'] ?? null);
        $product->setProductId($data['ProductId'] ?? null);
        $product->setGender($data['Gender'] ?? null);
        $product->setCategory($data['Category'] ?? null);
        $product->setSubCategory($data['SubCategory'] ?? null);
        $product->setProductType($data['ProductType'] ?? null);
        $product->setColour($data['Colour'] ?? null);
        $product->setProductUsage($data['ProductUsage'] ?? null);
        $product->setImage($data['Image'] ?? null);
        $product->setImageURL($data['ImageURL'] ?? null);

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $this->json(['message' => 'Product created successfully', 'id' => $product->getId()], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'admin_products_update', methods: ['PATCH'])]
    public function update(Request $request, Product $product): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['ProductTitle'])) {
            $product->setProductTitle($data['ProductTitle']);
        }
        if (isset($data['Price'])) {
            $product->setPrice($data['Price']);
        }
        if (isset($data['Gender'])) {
            $product->setGender($data['Gender']);
        }
        if (isset($data['Category'])) {
            $product->setCategory($data['Category']);
        }
        if (isset($data['SubCategory'])) {
            $product->setSubCategory($data['SubCategory']);
        }
        if (isset($data['ProductType'])) {
            $product->setProductType($data['ProductType']);
        }
        if (isset($data['Colour'])) {
            $product->setColour($data['Colour']);
        }
        if (isset($data['ProductUsage'])) {
            $product->setProductUsage($data['ProductUsage']);
        }
        if (isset($data['Image'])) {
            $product->setImage($data['Image']);
        }
        if (isset($data['ImageURL'])) {
            $product->setImageURL($data['ImageURL']);
        }
        $this->entityManager->flush();

        return $this->json(['message' => 'Product updated successfully']);
    }

    #[Route('/{id}', name: 'admin_products_delete', methods: ['DELETE'])]
    public function delete(Product $product): JsonResponse
    {
        $this->entityManager->remove($product);
        $this->entityManager->flush();

        return $this->json(['message' => 'Product deleted successfully']);
    }
}
