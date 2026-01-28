# 🎉 EventHub - Gestion d'Événements & Inscriptions

Application web complète pour la gestion d'événements et d'inscriptions, développée avec la stack PERN (PostgreSQL, Express, React, Node.js).


## 🎯 Vue d'ensemble

EventHub est une application web moderne permettant de gérer :
- ✅ **Événements** : Création, modification, publication et annulation
- ✅ **Participants** : Gestion complète des participants
- ✅ **Inscriptions** : Gestion des inscriptions aux événements
- ✅ **Dashboard** : Statistiques et vue d'ensemble
- ✅ **Utilisateurs** : Gestion des comptes admin et staff

## ✨ Fonctionnalités

### 🔐 Authentification & Rôles
- Authentification JWT sécurisée
- Deux rôles : **Admin** et **Staff**
- Protection des routes selon les permissions

### 📅 Gestion des Événements
- Création, modification et suppression d'événements
- Statuts : `draft`, `published`, `cancelled`
- Filtres avancés (statut, date, recherche)
- Limite de participants configurable
- Règle métier : Impossible d'inscrire sur un événement non publié

### 👥 Gestion des Participants
- CRUD complet des participants
- Recherche par nom ou email
- Inscription directe depuis la page participants

### 📝 Gestion des Inscriptions
- Création d'inscriptions participant → événement
- Statuts : `pending`, `confirmed`, `cancelled`
- Modification du statut des inscriptions
- Filtres par événement et statut
- Règles métier :
  - Pas de double inscription
  - Respect de la limite de participants
  - Annulation automatique si événement annulé

### 📊 Dashboard
- Nombre total d'événements
- Événements publiés
- Inscriptions du jour
- Top 5 événements les plus remplis

### 👤 Gestion des Utilisateurs (Admin uniquement)
- CRUD complet des utilisateurs système
- Attribution des rôles (admin/staff)
- Gestion des mots de passe

## 🛠 Technologies

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcrypt** - Hashage des mots de passe
- **Zod** - Validation des données
- **dotenv** - Gestion des variables d'environnement

### Frontend
- **React** - Bibliothèque UI
- **Vite** - Build tool moderne
- **React Router DOM** - Navigation
- **Axios** - Client HTTP
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Icônes SVG

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18 ou supérieur)
- **PostgreSQL** (v12 ou supérieur)
- **npm** ou **yarn**

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone "https://github.com/Safaa-Ettalhi/eventhub.git"
cd eventhub
```

### 2. Installer les dépendances Backend

```bash
cd backend
npm install
```

### 3. Installer les dépendances Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### 1. Configuration PostgreSQL

Créez une base de données PostgreSQL :

```sql
CREATE DATABASE eventhub;
```

### 2. Configuration Backend

Créez un fichier `backend/.env` à partir de `backend/.env.exemple` :

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eventhub
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=7d
PORT=5000
```

### 3. Configuration Frontend

Le frontend est configuré pour se connecter à `http://localhost:5000` par défaut. Si votre backend tourne sur un autre port, modifiez `frontend/vite.config.js`.

## 🗄️ Initialisation de la Base de Données

### 1. Créer les tables

```bash
cd backend
npm run init-db
```

Cette commande exécute `backend/database/schema.sql` et crée toutes les tables nécessaires.

### 2. Remplir avec des données de test

```bash
npm run seed
```

Cette commande crée :
- 2 utilisateurs (1 admin, 1 staff)
- 5 événements (3 publiés, 1 brouillon, 1 annulé)
- 10 participants
- 20 inscriptions

## 🎮 Utilisation

### Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Démarrer le Frontend

```bash
cd frontend
npm run dev
```

L'application démarre sur `http://localhost:3000` (ou un autre port si 3000 est occupé)

### Accéder à l'application

Ouvrez votre navigateur sur `http://localhost:3000`

## 🔑 Identifiants de Test

Après avoir exécuté `npm run seed`, vous pouvez vous connecter avec :

### Administrateur
- **Email** : `admin@eventhub.ma`
- **Mot de passe** : `password123`
- **Permissions** : Gestion complète (événements + utilisateurs)

### Staff
- **Email** : `staff@eventhub.ma`
- **Mot de passe** : `password123`
- **Permissions** : Gestion des événements + inscriptions

## 📁 Structure du Projet

```
event/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuration PostgreSQL
│   ├── controllers/             # Logique métier
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   ├── participant.controller.js
│   │   ├── registration.controller.js
│   │   ├── dashboard.controller.js
│   │   └── user.controller.js
│   ├── database/
│   │   └── schema.sql           # Schéma de base de données
│   ├── middleware/
│   │   ├── auth.middleware.js   # Authentification JWT
│   │   └── errorHandler.js      # Gestion d'erreurs
│   ├── routes/                  # Routes API
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── participant.routes.js
│   │   ├── registration.routes.js
│   │   ├── dashboard.routes.js
│   │   └── user.routes.js
│   ├── scripts/
│   │   ├── init-db.js           # Initialisation DB
│   │   └── seed.js              # Données de test
│   ├── utils/
│   │   └── validation.js        # Schémas Zod
│   ├── .env                      # Variables d'environnement
│   ├── .env.exemple              # Exemple de configuration
│   ├── package.json
│   └── server.js                # Point d'entrée
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── Layout.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── ParticlesBackground.jsx
│   │   │   └── Confetti.jsx
│   │   ├── context/            # Contextes React
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/              # Pages de l'application
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Participants.jsx
│   │   │   ├── Registrations.jsx
│   │   │   └── Users.jsx
│   │   ├── services/
│   │   │   └── api.js          # Configuration Axios
│   │   ├── App.jsx             # Composant racine
│   │   └── index.css           # Styles globaux
│   ├── package.json
│   └── vite.config.js
│
├── README.md                    # Ce fichier
```

## 🔌 API REST

### Authentification

```
POST   /api/auth/login          # Connexion
GET    /api/auth/me             # Informations utilisateur
```

### Événements

```
POST   /api/events              # Créer (admin, staff)
GET    /api/events              # Liste (tous)
GET    /api/events/:id          # Détails (tous)
PUT    /api/events/:id          # Modifier (admin, staff)
DELETE /api/events/:id          # Supprimer (admin, staff)
PATCH  /api/events/:id/status   # Changer statut (admin, staff)
```

### Participants

```
POST   /api/participants        # Créer (tous)
GET    /api/participants         # Liste (tous)
GET    /api/participants/:id     # Détails (tous)
PUT    /api/participants/:id    # Modifier (tous)
DELETE /api/participants/:id    # Supprimer (tous)
```

### Inscriptions

```
POST   /api/registrations       # Créer (admin, staff)
GET    /api/registrations       # Liste (admin, staff)
PATCH  /api/registrations/:id/status  # Modifier statut (admin, staff)
```

### Dashboard

```
GET    /api/dashboard           # Statistiques (tous)
```

### Utilisateurs (Admin uniquement)

```
GET    /api/users               # Liste
GET    /api/users/:id           # Détails
POST   /api/users               # Créer
PUT    /api/users/:id           # Modifier
DELETE /api/users/:id           # Supprimer
```

## 👥 Rôles et Permissions

### 🔴 Admin
**Gestion complète** :
- ✅ Événements (CRUD complet)
- ✅ Participants (CRUD complet)
- ✅ Inscriptions (CRUD complet)
- ✅ Utilisateurs (CRUD complet) - **Exclusif admin**
- ✅ Dashboard

### 🔵 Staff
**Gestion limitée** :
- ✅ Événements (CRUD complet)
- ✅ Participants (CRUD complet)
- ✅ Inscriptions (CRUD complet)
- ❌ Utilisateurs (accès interdit)
- ✅ Dashboard

## 📊 Données de Test

Le script `seed.js` crée automatiquement :

- **2 Utilisateurs** :
  - Admin : `admin@eventhub.ma`
  - Staff : `staff@eventhub.ma`

- **5 Événements** :
  - Festival des Musiques du Monde - Fès (publié)
  - Conférence Tech Morocco 2025 (publié)
  - Salon du Livre de Rabat (publié)
  - Workshop Artisanat Traditionnel (brouillon)
  - Festival Gnaoua d'Essaouira (annulé)

- **10 Participants** avec noms et emails marocains

- **20 Inscriptions** avec différents statuts

## 🐛 Dépannage

### Erreur : "Cannot connect to database"

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les credentials dans `backend/.env`
3. Vérifiez que la base de données `eventhub` existe

### Erreur : "Port already in use"

Changez le port dans `backend/.env` :
```env
PORT=5001
```

### Erreur : "JWT_SECRET is required"

Assurez-vous d'avoir défini `JWT_SECRET` dans `backend/.env`

### Erreur lors de l'exécution des scripts

Assurez-vous d'être dans le bon dossier :
```bash
cd backend
npm run init-db
npm run seed
```

## 📝 Commandes Utiles

### Backend

```bash
# Initialiser la base de données
npm run init-db

# Remplir avec des données de test
npm run seed

# Démarrer en développement
npm run dev

# Démarrer en production
npm start
```

### Frontend

```bash
# Démarrer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🎨 Design

L'application utilise un design moderne et professionnel avec :
- 🌓 Mode sombre/clair
- ✨ Animations fluides
- 🎭 Glassmorphism
- 🎪 Effets visuels premium
- 📱 Design responsive

## 📄 Licence

ISC

## 👨‍💻 Auteur

Développé pour la gestion d'événements et d'inscriptions.

---

**Note** : Assurez-vous de configurer correctement votre fichier `.env` avant de démarrer l'application !
