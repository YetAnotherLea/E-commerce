<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:seed-demo-users', description: 'Crée les comptes de démonstration')]
class SeedDemoUsersCommand extends Command
{
    private const USERS = [
        ['admin@hainarie.fr', 'admin1234', ['ROLE_ADMIN']],
        ['client@hainarie.fr', 'client1234', ['ROLE_USER']],
    ];

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $repository = $this->entityManager->getRepository(User::class);

        foreach (self::USERS as [$email, $password, $roles]) {
            if (null !== $repository->findOneBy(['email' => $email])) {
                $io->text(sprintf('  %s existe déjà', $email));
                continue;
            }

            $user = new User();
            $user->setEmail($email);
            $user->setRoles($roles);
            $user->setPassword($this->passwordHasher->hashPassword($user, $password));
            $this->entityManager->persist($user);
            $io->text(sprintf('  %-22s %-12s %s', $email, $password, implode(', ', $roles)));
        }

        $this->entityManager->flush();
        $io->success('Comptes de démonstration prêts.');

        return Command::SUCCESS;
    }
}
