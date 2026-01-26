# Conception Base de Données - EventHub

## 📊 Schéma Entité-Relation (ERD)

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │
│ email (UK)  │
│ password    │
│ role        │
│ full_name   │
│ created_at  │
│ updated_at  │
└──────┬──────┘
       │
       │ 1
       │
       │ N
┌──────▼──────┐
│   events    │
├─────────────┤
│ id (PK)     │
│ title       │
│ description │
│ location    │
│ event_date  │
│ max_participants│
│ status      │
│ created_by (FK)│
│ created_at  │
│ updated_at  │
└──────┬──────┘
       │
       │ 1
       │
       │ N
┌──────▼──────────────┐
│  registrations     │
├────────────────────┤
│ id (PK)            │
│ event_id (FK)      │──┐
│ participant_id (FK)│──┤
│ status             │  │
│ created_at         │  │
│ updated_at         │  │
│ UNIQUE(event_id,   │  │
│        participant_id)│
└────────────────────┘  │
                        │
                        │ N
                        │
                        │ 1
                ┌───────┴───────┐
                │  participants │
                ├───────────────┤
                │ id (PK)       │
                │ full_name     │
                │ email (UK)    │
                │ phone         │
                │ created_at    │
                │ updated_at    │
                └───────────────┘
```

## 📋 Description des Tables

### Table: `users`

Utilisateurs du système (admin et staff).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Identifiant unique |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email de connexion |
| password | VARCHAR(255) | NOT NULL | Mot de passe hashé (bcrypt) |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('admin', 'staff') | Rôle utilisateur |
| full_name | VARCHAR(200) | NOT NULL | Nom complet |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

**Index recommandés :**
- `idx_users_email` sur `email` (déjà unique, index automatique)

### Table: `events`

Événements gérés par l'application.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Identifiant unique |
| title | VARCHAR(200) | NOT NULL | Titre de l'événement |
| description | TEXT | NULL | Description détaillée |
| location | VARCHAR(255) | NOT NULL | Lieu de l'événement |
| event_date | TIMESTAMP | NOT NULL | Date et heure de l'événement |
| max_participants | INTEGER | NOT NULL, CHECK > 0 | Nombre maximum de participants |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft', CHECK IN ('draft', 'published', 'cancelled') | Statut de l'événement |
| created_by | UUID | NOT NULL, FK → users(id) | Créateur de l'événement |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

**Index recommandés :**
- `idx_events_status` sur `status` (pour filtrage)
- `idx_events_event_date` sur `event_date` (pour tri et recherche)
- `idx_events_created_by` sur `created_by` (FK)

**Règles métier :**
- Seuls les événements avec `status = 'published'` peuvent recevoir des inscriptions
- Quand `status` passe à `'cancelled'`, toutes les inscriptions associées passent en `'cancelled'`

### Table: `participants`

Participants aux événements.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Identifiant unique |
| full_name | VARCHAR(200) | NOT NULL | Nom complet |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email (unique) |
| phone | VARCHAR(50) | NULL | Téléphone (optionnel) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

**Index recommandés :**
- `idx_participants_email` sur `email` (déjà unique, index automatique)
- `idx_participants_full_name` sur `full_name` (pour recherche)

### Table: `registrations`

Inscriptions des participants aux événements (relation N-N).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Identifiant unique |
| event_id | UUID | NOT NULL, FK → events(id) ON DELETE CASCADE | Événement |
| participant_id | UUID | NOT NULL, FK → participants(id) ON DELETE CASCADE | Participant |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending', CHECK IN ('pending', 'confirmed', 'cancelled') | Statut de l'inscription |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |
| UNIQUE(event_id, participant_id) | | | Contrainte d'unicité |

**Index recommandés :**
- `idx_registrations_event_id` sur `event_id` (FK, pour jointures)
- `idx_registrations_participant_id` sur `participant_id` (FK, pour jointures)
- `idx_registrations_status` sur `status` (pour filtrage)
- `idx_registrations_created_at` sur `created_at` (pour tri)

**Règles métier :**
1. Un participant ne peut pas s'inscrire 2 fois au même événement (contrainte UNIQUE)
2. Ne pas dépasser `maxParticipants` de l'événement
3. Impossible de s'inscrire à un événement non publié (vérifié en application)
4. Quand un événement est annulé, toutes ses inscriptions passent en `'cancelled'` (trigger/application)

## 🔗 Relations

1. **users → events** (1-N)
   - Un utilisateur peut créer plusieurs événements
   - `events.created_by` → `users.id`
   - ON DELETE CASCADE : si un utilisateur est supprimé, ses événements sont supprimés

2. **events → registrations** (1-N)
   - Un événement peut avoir plusieurs inscriptions
   - `registrations.event_id` → `events.id`
   - ON DELETE CASCADE : si un événement est supprimé, ses inscriptions sont supprimées

3. **participants → registrations** (1-N)
   - Un participant peut s'inscrire à plusieurs événements
   - `registrations.participant_id` → `participants.id`
   - ON DELETE CASCADE : si un participant est supprimé, ses inscriptions sont supprimées

4. **events ↔ participants** (N-N via registrations)
   - Relation many-to-many via la table `registrations`
   - Un événement peut avoir plusieurs participants
   - Un participant peut s'inscrire à plusieurs événements

## 🔍 Index et Performance

### Index créés automatiquement
- Toutes les clés primaires (PK)
- Toutes les clés étrangères (FK)
- Toutes les colonnes UNIQUE

### Index supplémentaires recommandés

```sql
-- Events
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Participants
CREATE INDEX idx_participants_full_name ON participants(full_name);

-- Registrations
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
```

Ces index améliorent les performances pour :
- Filtrage par statut
- Recherche par date
- Recherche par nom
- Tri par date de création
- Jointures entre tables

## 🔒 Contraintes

### Contraintes de domaine (CHECK)

- `users.role` : doit être 'admin' ou 'staff'
- `events.status` : doit être 'draft', 'published' ou 'cancelled'
- `events.max_participants` : doit être > 0
- `registrations.status` : doit être 'pending', 'confirmed' ou 'cancelled'

### Contraintes d'unicité (UNIQUE)

- `users.email` : email unique
- `participants.email` : email unique
- `registrations(event_id, participant_id)` : un participant ne peut s'inscrire qu'une fois par événement

### Contraintes de référence (FOREIGN KEY)

- `events.created_by` → `users.id` (ON DELETE CASCADE)
- `registrations.event_id` → `events.id` (ON DELETE CASCADE)
- `registrations.participant_id` → `participants.id` (ON DELETE CASCADE)

## 🔄 Triggers

### Trigger `update_updated_at_column`

Mise à jour automatique de `updated_at` lors de toute modification :

```sql
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📈 Requêtes fréquentes optimisées

### 1. Liste des événements avec filtres
```sql
SELECT * FROM events 
WHERE status = 'published' 
  AND DATE(event_date) = '2025-03-15'
ORDER BY event_date DESC;
```
**Index utilisés :** `idx_events_status`, `idx_events_event_date`

### 2. Recherche de participants
```sql
SELECT * FROM participants 
WHERE full_name ILIKE '%Dupont%' 
   OR email ILIKE '%dupont%';
```
**Index utilisé :** `idx_participants_full_name`, `idx_participants_email`

### 3. Inscriptions d'un événement avec détails
```sql
SELECT r.*, e.title, p.full_name, p.email
FROM registrations r
JOIN events e ON r.event_id = e.id
JOIN participants p ON r.participant_id = p.id
WHERE r.event_id = '...'
ORDER BY r.created_at DESC;
```
**Index utilisés :** `idx_registrations_event_id`, `idx_registrations_created_at`

### 4. Dashboard - Top événements remplis
```sql
SELECT 
  e.id, e.title, e.max_participants,
  COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed')) as current_count,
  ROUND((COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed'))::numeric / 
         NULLIF(e.max_participants, 0)) * 100, 2) as fill_percentage
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
WHERE e.status = 'published'
GROUP BY e.id, e.title, e.max_participants
ORDER BY fill_percentage DESC, current_count DESC
LIMIT 5;
```
**Index utilisés :** `idx_events_status`, `idx_registrations_event_id`, `idx_registrations_status`

## 🎯 Normalisation

La base de données est normalisée en **3NF (Troisième Forme Normale)** :

- Pas de redondance de données
- Chaque table représente une entité unique
- Les relations sont gérées via des clés étrangères
- Pas de dépendances transitives

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt (salt rounds: 10)
- JWT pour l'authentification
- Validation des entrées avec Zod
- Protection contre les injections SQL via requêtes paramétrées (pg)
- Contraintes au niveau base de données pour l'intégrité
