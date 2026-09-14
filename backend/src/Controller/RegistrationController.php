<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Inscription publique.
 *
 * Auparavant le front postait sur /api/admin/users en transmettant `roles`, ce qui
 * permettait à n'importe qui de se créer un compte ROLE_ADMIN. Ici le rôle est
 * imposé par le serveur et tout `roles` reçu du client est ignoré.
 */
class RegistrationController extends AbstractController
{
    private const MIN_PASSWORD_LENGTH = 8;

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true) ?? [];

        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if ('' === $email || '' === $password) {
            return $this->json(
                ['message' => 'Email and password are required.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['message' => 'Invalid email address.'], Response::HTTP_BAD_REQUEST);
        }

        if (strlen($password) < self::MIN_PASSWORD_LENGTH) {
            return $this->json(
                ['message' => sprintf('Password must be at least %d characters.', self::MIN_PASSWORD_LENGTH)],
                Response::HTTP_BAD_REQUEST
            );
        }

        if (null !== $userRepository->findOneBy(['email' => $email])) {
            return $this->json(['message' => 'This email is already registered.'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($email);
        // Le rôle n'est jamais pris depuis la requête.
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'Account created successfully.',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ], Response::HTTP_CREATED);
    }
}
