# Hainarie — boutique de vêtements en ligne

![screenshot](./frontend/src/assets/screenshot.png)

<p align="center">
  <img loading="lazy" src="https://img.shields.io/badge/PHP-8.2+-blue?logo=php&logoColor=white"/>
  <img loading="lazy" src="https://img.shields.io/badge/Symfony-7.3-black?logo=symfony&logoColor=white"/>
  <img loading="lazy" src="https://img.shields.io/badge/React-19.1-blue?logo=react&logoColor=white"/>
  <img loading="lazy" src="https://img.shields.io/badge/MariaDB-11-orange?logo=mariadb&logoColor=white"/>
</p>

🌐 **Démo en ligne : [ecommerce.leaballester.com](https://ecommerce.leaballester.com)**

Projet Epitech réalisé à deux en **4 semaines / 7 sprints** (SCRUM, user stories, soutenances intermédiaires), puis repris et mis en production. Front React + API Symfony, séparés.

> Site de démonstration : le tunnel d'achat enregistre une commande mais **aucun paiement n'est traité** et aucune coordonnée bancaire n'est demandée.

## Fonctionnalités

- **Catalogue** de 38 vêtements et accessoires, filtrable par catégorie, genre, sous-catégorie, type, couleur et utilisation, avec tri, recherche et pagination
- **Panier** persistant côté navigateur
- **Comptes** : inscription, connexion par session serveur, rôles `ROLE_USER` / `ROLE_ADMIN`
- **Tableau de bord admin** : création, modification et suppression de produits et d'utilisateurs
- **Thème clair / sombre**
- **Catalogue importé** depuis une API de vêtements par une commande Symfony, images converties en WebP et servies localement — le site ne dépend d'aucun service tiers à l'exécution

## Stack

| Couche     | Techno                                     |
| ---------- | ------------------------------------------ |
| Front      | React 19, React Router 7, Vite 7, Axios    |
| API        | Symfony 7.3, Doctrine ORM, PHP 8.2+        |
| Base       | MariaDB / MySQL                            |
| Production | nginx + PHP-FPM, Let's Encrypt, Cloudflare |

## Sommaire

1. [Installation](#installation)
2. [Démarrage](#démarrage)
3. [Configuration](#configuration)
4. [Commandes utiles](#commandes-utiles)
5. [Déploiement](#déploiement)
6. [Pistes d'amélioration](#pistes-damélioration)
7. [Collaborateurs](#collaborateurs)

---

## Installation

Prérequis : PHP ≥ 8.2 avec les extensions `pdo_mysql`, `gd`, `intl`, `mbstring` · Composer · Node ≥ 20 · MariaDB ou MySQL.

```bash
git clone git@github.com:YetAnotherLea/E-commerce.git
cd E-commerce
```

**Backend**

```bash
cd backend
composer install
```

Créez `backend/.env.local` (ignoré par git) avec vos identifiants de base :

```dotenv
DATABASE_URL="mysql://user:password@127.0.0.1:3306/ecommerce?serverVersion=11.8.6-MariaDB&charset=utf8mb4"
```

Puis le schéma et le catalogue :

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console app:import-products
```

**Frontend**

```bash
cd frontend
npm install
```

## Démarrage

Deux terminaux :

```bash
cd backend && symfony server:start     # API sur http://127.0.0.1:8000
cd frontend && npm run dev             # Front sur http://localhost:5173
```

Le front appelle l'API via `VITE_API_URL`, défini dans `frontend/.env.development`.

## Configuration

Le projet suit la convention Symfony : `.env` contient des valeurs par défaut sans secret et est versionné ; les surcharges locales et les secrets vont dans `.env.local`, jamais commité.

| Variable                | Rôle                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `APP_ENV` / `APP_DEBUG` | `dev` / `1` en local, `prod` / `0` en production                                                                            |
| `APP_SECRET`            | Secret Symfony — à générer en production : `php -r 'echo bin2hex(random_bytes(32));'`                                       |
| `DATABASE_URL`          | Connexion MariaDB/MySQL                                                                                                     |
| `CORS_ALLOW_ORIGIN`     | Origine du front en développement (`http://localhost:5173`). Inutile en production, front et API partageant le même domaine |
| `PRODUCTS_API_URL`      | Source du catalogue, `https://dummyjson.com` par défaut                                                                     |
| `VITE_API_URL`          | Côté front : `http://localhost:8000/api` en dev, `/api` en prod                                                             |

## Commandes utiles

| Commande                              | Effet                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `php bin/console app:import-products` | Vide et réimporte le catalogue depuis l'API. `--keep` conserve les produits existants |
| `php bin/console app:seed-demo-users` | Crée le compte de démonstration `client@hainarie.fr` / `client1234`                   |
| `npm run lint`                        | ESLint sur le front                                                                   |
| `npm run build`                       | Build de production dans `frontend/dist/`                                             |

Aucun compte administrateur n'est créé automatiquement : à créer à la main avec un mot de passe fort.

## Déploiement

Front et API sont servis **sur le même domaine** par nginx : `/` sert le build Vite, `/api` est transmis à Symfony via PHP-FPM, `/uploads` sert les images produits. Ce choix supprime le CORS et permet une authentification par cookie de session `HttpOnly` + `Secure`.

Séquence de mise à jour après un `git pull` :

```bash
cd backend
composer install --no-dev --optimize-autoloader
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console cache:clear
cd ../frontend
npm ci && npm run build
```

Points d'attention :

- `backend/.env.local` doit être lisible par l'utilisateur PHP-FPM (`www-data`) : `chgrp www-data` + `chmod 640`
- `backend/var/` et `backend/public/uploads/` doivent être accessibles en écriture à PHP-FPM
- le bloc PHP de nginx doit passer `fastcgi_param HTTPS on`, sinon le cookie de session `Secure` n'est jamais posé
- le site de démo est volontairement non indexé (`robots.txt`, meta `noindex`, en-tête `X-Robots-Tag`)

## Pistes d'amélioration

- Commandes persistées côté serveur (`Order`, `OrderItem`) et paiement Stripe
- Facture PDF
- Avis clients, gestion des stocks, recommandations
- Suivi de livraison via une API transporteur
- Notifications temps réel
- Déploiement automatisé par GitHub Actions

## Collaborateurs

- **Stefan-Paris Paduraru** — back-end
- **Léa Ballester** — front-end
