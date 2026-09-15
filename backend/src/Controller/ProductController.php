<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;

class ProductController extends AbstractController
{
    private const MAX_PAGE_SIZE = 100;

    public function __construct(private readonly LoggerInterface $logger)
    {
    }

    #[Route('/api/products', name: 'api_products_list', methods: ['GET', 'POST', 'OPTIONS'])]
    public function list(Request $request, ProductRepository $productRepository): JsonResponse
    {
        try {
            $payload = [];
            $sort = [];
            $page = max(1, $request->query->getInt('page', 1));
            $pageSize = min(max(1, $request->query->getInt('pageSize', 20)), self::MAX_PAGE_SIZE);

            if ($request->isMethod('POST')) {
                $data = json_decode($request->getContent(), true) ?? [];
                $payload = $data['payload'] ?? [];
                $sort = $data['sort'] ?? [];
            }

            $qb = $productRepository->createQueryBuilder('p');

            // Map common frontend field names to entity properties if different
            $mapping = [
                'usage' => 'ProductUsage',
                'Usage' => 'ProductUsage',
                'productType' => 'ProductType',
                'Product type' => 'ProductType',
                'product_type' => 'ProductType',
                'category' => 'Category',
                'gender' => 'Gender',
                'subCategory' => 'SubCategory',
                'colour' => 'Colour',
                'price' => 'Price'
            ];

            // Define the properties we allow filtering on to avoid expensive Reflection
            $allowedProperties = [
                'id', 'ProductId', 'Gender', 'Category', 'SubCategory', 
                'ProductType', 'Colour', 'ProductUsage', 'ProductTitle', 'Price'
            ];
            $caseMap = [];
            foreach ($allowedProperties as $p) {
                $caseMap[strtolower($p)] = $p;
            }

            foreach ($payload as $key => $value) {
                if ($value === null || $value === '' || $value === 'All') continue;
                
                $entityKey = $mapping[$key] ?? $caseMap[strtolower($key)] ?? ucfirst($key);
                
                // Final check to ensure the key is safe (present in our allowed list)
                if (!in_array($entityKey, $allowedProperties)) {
                    continue;
                }

                if ($entityKey === 'ProductTitle' && is_array($value) && isset($value['$regex'])) {
                    $qb->andWhere('p.ProductTitle LIKE :titleRegex')
                       ->setParameter('titleRegex', '%' . $value['$regex'] . '%');
                } elseif (!is_array($value)) {
                    $qb->andWhere("p.{$entityKey} = :val_{$entityKey}")
                       ->setParameter("val_{$entityKey}", $value);
                }
            }

            foreach ($sort as $field => $order) {
                $entitySortField = $mapping[$field] ?? $caseMap[strtolower($field)] ?? ucfirst($field);
                if (!in_array($entitySortField, $allowedProperties)) continue;
                $direction = ($order === 1 || strtolower($order) === 'asc' || $order === 'asc') ? 'ASC' : 'DESC';
                $qb->addOrderBy("p.{$entitySortField}", $direction);
            }

            $qb->setFirstResult(($page - 1) * $pageSize)
               ->setMaxResults($pageSize);

            $products = $qb->getQuery()->getResult();

            return $this->json($products);
        } catch (\Exception $e) {
            $this->logger->error('Product listing failed', ['exception' => $e]);

            return $this->json(['error' => 'Unable to fetch products.'], 500);
        }
    }

    #[Route('/api/products/{id}', name: 'api_products_show', methods: ['GET'])]
    public function show(string $id, ProductRepository $productRepository): JsonResponse
    {
        // Prioritize finding by ProductId (the one used in links) 
        // fallback to autoincrement ID if not found
        $product = $productRepository->findOneBy(['ProductId' => $id]) ?? $productRepository->find($id);

        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        return $this->json($product);
    }

    #[Route('/api/distinct', name: 'api_products_distinct', methods: ['GET', 'OPTIONS'])]
    public function distinct(Request $request, ProductRepository $productRepository): JsonResponse
    {
        $field = $request->query->get('field');
        if (!$field) {
            return $this->json([]);
        }

        $allowedProperties = [
            'Gender', 'Category', 'SubCategory', 'ProductType', 'Colour', 'ProductUsage'
        ];
        $caseMap = ['usage' => 'ProductUsage'];
        foreach ($allowedProperties as $p) {
            $caseMap[strtolower($p)] = $p;
        }

        $field = $caseMap[strtolower($field)] ?? $field;

        if (!in_array($field, $allowedProperties)) {
            return $this->json([]);
        }

        $qb = $productRepository->createQueryBuilder('p')
            ->select("DISTINCT p.{$field}")
            ->where("p.{$field} IS NOT NULL");
            
        $results = $qb->getQuery()->getScalarResult();
        return $this->json(array_column($results, $field));
    }

    #[Route('/api/categories', name: 'api_categories_list', methods: ['GET', 'OPTIONS'])]
    public function listCategories(ProductRepository $productRepository): JsonResponse
    {
        $qb = $productRepository->createQueryBuilder('p')
            ->select('p.SubCategory AS name, MIN(p.ImageURL) AS image')
            ->where('p.SubCategory IS NOT NULL')
            ->andWhere('p.ImageURL IS NOT NULL')
            ->groupBy('p.SubCategory')
            ->orderBy('p.SubCategory', 'ASC');

        return $this->json($qb->getQuery()->getArrayResult());
    }
}