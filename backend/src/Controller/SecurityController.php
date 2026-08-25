<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // 1. Vérifiez si l'email et le mot de passe sont présents
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json(['message' => 'Email and password are required.'], Response::HTTP_BAD_REQUEST);
        }

        // 2. Recherchez l'utilisateur dans la base de données
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        // 3. Vérifiez si l'utilisateur existe
        if (!$user) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        // 4. Vérifiez le mot de passe
        if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        // 5. Authentification réussie
        return $this->json([
            'message' => 'Login successful!',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ]
        ]);
    }
    
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        
        return $this->json(['message' => 'Logout successful!']);
    }
}