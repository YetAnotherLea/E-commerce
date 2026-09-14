<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class SecurityController extends AbstractController
{
    /**
     * L'authentification est assurée par le firewall (json_login dans
     * security.yaml) : il lit {"email": ..., "password": ...}, vérifie le mot de
     * passe et ouvre la session. Cette méthode n'est atteinte qu'en cas de succès.
     */
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'message' => 'Login successful!',
            'user' => $this->serializeUser($user),
        ]);
    }

    /**
     * Interceptée par le firewall avant d'arriver ici (logout.path dans
     * security.yaml). La réponse est produite par LogoutSubscriber.
     */
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): never
    {
        throw new \LogicException('Cette méthode est interceptée par le firewall de sécurité.');
    }

    /**
     * Source de vérité de la session côté front : c'est le serveur qui dit qui
     * est connecté, jamais le localStorage du navigateur.
     */
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json(['message' => 'Not authenticated.'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json($this->serializeUser($user));
    }

    /**
     * Ne jamais exposer le hash du mot de passe.
     */
    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ];
    }
}
