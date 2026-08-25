<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ProductApiClient
{
    private HttpClientInterface $httpClient;
    private string $apiUrl;
    private string $apiKey;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
        $this->apiUrl = 'http://10.79.217.89:3000';
        $this->apiKey = 'bCdhbm7pZSBwcm9jaGFpbmUgYydlc3QgZHlsYW4h';
    }

    public function getProducts(): array
    {
        try {
            $response = $this->httpClient->request('GET', "{$this->apiUrl}/products", [
                'headers' => [
                    'X-Auth' => $this->apiKey,
                ],
            ]);

            return $response->toArray();
        } catch (TransportExceptionInterface $e) {
            
            return [];
        }
    }

    public function getProductById(string $id): ?array
    {
        try {
            // API-ul extern folosește cerere POST cu payload pentru a filtra
            $response = $this->httpClient->request('POST', "{$this->apiUrl}/products", [
                'headers' => [
                    'X-Auth' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'payload' => [
                        '_id' => $id,
                    ],
                ],
            ]);

            $products = $response->toArray();

            // API-ul returnează o listă, chiar dacă e un singur rezultat.
            // Luăm primul element, dacă există.
            return $products[0] ?? null;

        } catch (TransportExceptionInterface $e) {
            return null;
        }
    }
}