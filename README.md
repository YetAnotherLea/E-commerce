# E-commerce Project

![screenshot](./frontend/src/assets/screenshot.png)

<p align="center">
  <img loading="lazy" src="https://img.shields.io/badge/PHP-8.2-blue?logo=php&logoColor=white"/>
  <img loading="lazy" src="https://img.shields.io/badge/Symfony-7.3-black?logo=symfony&logoColor=white"/>
  <img loading="lazy" src="https://img.shields.io/badge/React-19.1-blue?logo=react&logoColor=white"/>
  <img loading="lazy" src="https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql&logoColor=white"/>
</p>

**Objectif** : développer une boutique en ligne dédiée aux vêtements.  
**Méthodologie** : Agile (SCRUM) avec gestion par sprints, user stories et soutenances intermédiaires.  
**Durée du projet** : 4 semaines / 7 sprints

Le site inclut :

- Gestion utilisateurs (inscription, connexion, rôles admin/utilisateur)
- Catalogue de produits avec filtres, tri et avis
- Panier
- Administration des produits
- Livraison avec intégration API transporteur
- Optimisation SEO (balises meta, liens, etc.)

## Sommaire

1. [Installation](#-installation)
2. [Démarrage](#-démarrage)
3. [Pistes d’amélioration](#-pistes-damélioration)
4. [Collaborateurs](#-collaborateurs)

---

## 🔧 Installation

1. Cloner le dépôt :

   ```bash
   git clone git@github.com:EpitechWebAcademiePromo2026/W-WEB-502-MAR-2-1-ecommerce-lea.ballester.git
   git checkout main
   ```

2. Installer les dépendances **Symfony** (côté serveur) :

   ```bash
   cd backend
   touch .env
   echo 'APP_ENV=dev' > .env
   echo 'APP_SECRET=' >> .env
   echo 'DATABASE_URL="mysql://user:password@127.0.0.1:3306/ecommerce"' >> .env
   echo 'MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0' >> .env
   echo 'MAILER_DSN=null://null' >> .env
   echo 'CORS_ALLOW_ORIGIN="http://localhost:5173"' >> .env
   ```

   N'oubliez pas de configurer votre SQL avant de lancer composer install

   ```bash
   composer install
   ```

3. Installer les dépendances **React** (côté client) :

   ```bash
   cd frontend
   npm install
   ```

4. Configurer la base de données MySQL dans `.env` (Symfony) :

   ```dotenv
   DATABASE_URL="mysql://user:password@127.0.0.1:3306/ecommerce"
   ```

5. Créer le schéma et exécuter les migrations :

   ```bash
   ## php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate
   ```

## Démarrage

### Lancer le back-end (Symfony)

```bash
cd backend
symfony server:start
```

### Lancer le front-end (React)

```bash
cd frontend
npm run dev
```

Le projet est alors accessible sur :

- API : `http://127.0.0.1:8000`
- Frontend : `http://localhost:5173` (peut changer selon votre configuration React)

## Pistes d’amélioration

- Ajout d’un système de recommandations produits
- Intégration d’un paiement en ligne sécurisé (Stripe/PayPal)
- Système de notifications en temps réel (commandes, livraisons)
- Interface mobile (PWA)
- Tableau de bord analytique pour les administrateurs
- Système de commandes/livraisons
- CSS plus poussé et plus responsive
- Gestion des stocks

## Collaborateurs

- [Stefan-Paris Paduraru] - Développeur Back-end
- [Léa Ballester] - Développeur Front-end
