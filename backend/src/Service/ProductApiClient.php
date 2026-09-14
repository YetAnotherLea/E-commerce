<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\Exception\ExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

// Client de l'API vêtements. L'URL vient de PRODUCTS_API_URL.
class ProductApiClient
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly LoggerInterface $logger,
        #[Autowire('%products_api_url%')]
        private readonly string $apiUrl,
    ) {
    }

    /** @return string[] */
    public function getClothingCategories(): array
    {
        return [
            'mens-shirts',
            'mens-shoes',
            'womens-dresses',
            'womens-shoes',
            'womens-bags',
            'womens-jewellery',
            'tops',
            'sunglasses',
        ];
    }

    /** @return array<int, array<string, mixed>> [] si l'appel échoue */
    public function getProductsByCategory(string $category): array
    {
        try {
            $response = $this->httpClient->request(
                'GET',
                sprintf('%s/products/category/%s', rtrim($this->apiUrl, '/'), rawurlencode($category)),
                ['query' => ['limit' => 0]]
            );

            return $response->toArray()['products'] ?? [];
        } catch (ExceptionInterface $e) {
            $this->logger->error('Clothing API request failed', [
                'category' => $category,
                'exception' => $e,
            ]);

            return [];
        }
    }
}
