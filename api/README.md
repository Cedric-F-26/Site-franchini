# 📡 API Franchini - Backend Sécurisé

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
cd api
npm install
```

### 2. Démarrage du serveur
```bash
# Développement (avec redémarrage automatique)
npm run dev

# Production
npm start
```

### 3. Configuration

**Serveur** : `http://localhost:3001`
**Endpoint principal** : `POST /api/login`

## 🔐 Fonctionnalités de Sécurité

### ✅ **Protection Contre les Attaques**
- **Rate Limiting** : Maximum 5 tentatives par 15 minutes
- **Password Hashing** : BCrypt avec salt
- **JWT Tokens** : Sessions sécurisées avec expiration 24h
- **CORS** : Configuration sécurisée
- **Validation des entrées** : Protection injection

### 📋 **Endpoints API**

#### `POST /api/login`
**Corps de la requête :**
```json
{
    "username": "admin",
    "password": "votre_mot_de_passe"
}
```

**Réponse succès :**
```json
{
    "success": true,
    "message": "Connexion réussie",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "username": "admin",
        "role": "admin",
        "email": "admin@franchini.fr"
    }
}
```

**Réponse erreur :**
```json
{
    "success": false,
    "message": "Identifiant ou mot de passe incorrect"
}
```

#### `GET /api/admin/dashboard` (protégé)
**Headers requis :**
```
Authorization: Bearer <token_jwt>
```

## 🔑 Gestion des Utilisateurs

### Mot de passe par défaut
- **Utilisateur** : `admin`
- **Mot de passe** : `Franchini2024!`

### 🔧 Personnalisation

#### Changer le mot de passe
1. Générez un nouveau hash BCrypt :
```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'votre_nouveau_mot_de_passe';
const hashedPassword = await bcrypt.hash(newPassword, 10);
console.log('Nouveau hash:', hashedPassword);
```

2. Remplacez dans le tableau `users` du fichier `server.js`

#### Ajouter des utilisateurs
```javascript
const newUser = {
    id: 2,
    username: 'utilisateur2',
    password: '$2b$10$nouveau_hash_bcrypt',
    role: 'editor',
    email: 'user2@franchini.fr'
};
users.push(newUser);
```

## 🛡️ Sécurité en Production

### ⚠️ **Recommandations**
1. **Base de données réelle** : Remplacez le tableau par MySQL/PostgreSQL
2. **Variables d'environnement** : Utilisez `.env` pour les secrets
3. **HTTPS** : Configurez SSL/TLS en production
4. **Logs** : Implémentez un système de logs
5. **Monitoring** : Surveillez les tentatives d'accès

### 🔒 Variables d'environnement recommandées
```bash
# .env
JWT_SECRET=votre-secret-super-long-et-aleatoire-2024
DB_HOST=localhost
DB_USER=franchini_admin
DB_PASS=mot_de_passe_bdd
DB_NAME=franchini_db
NODE_ENV=production
```

## 📝 Intégration avec le Frontend

L'API est déjà configurée dans `connexion.html` avec :
- `fetch('/api/login', ...)`
- Gestion des tokens JWT
- Redirection automatique en cas de succès

## 🚀 Déploiement

### Docker (recommandé)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2 (production)
```bash
npm install -g pm2
pm2 start server.js --name "franchini-api"
```

---
**🔐 API sécurisée et prête pour la production !**
