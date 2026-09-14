<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
#[Route('/api/admin/users')]
class AdminUserController extends AbstractController
{
    private const ASSIGNABLE_ROLES = ['ROLE_USER', 'ROLE_ADMIN'];

    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('', name: 'admin_users_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            return $this->json(['message' => 'Email and password are required.'], Response::HTTP_BAD_REQUEST);
        }

        // Liste blanche : un admin peut attribuer un rôle, mais pas n'importe lequel.
        $requestedRoles = $data['roles'] ?? ['ROLE_USER'];
        $roles = array_values(array_intersect(
            is_array($requestedRoles) ? $requestedRoles : ['ROLE_USER'],
            self::ASSIGNABLE_ROLES
        ));

        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles($roles ?: ['ROLE_USER']);

        // Crypte le mot de passe avant de le set
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json(['message' => 'User created successfully', 'id' => $user->getId()], Response::HTTP_CREATED);
    }

    #[Route('', name: 'admin_users_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)->findAll();

        $usersArray = [];
        foreach ($users as $user) {
            $usersArray[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ];
        }

        return $this->json($usersArray);
    }

    #[Route('/{id}', name: 'admin_users_delete', methods: ['DELETE'])]
    public function delete(User $user): JsonResponse
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return $this->json(['message' => 'User deleted successfully']);
    }
}