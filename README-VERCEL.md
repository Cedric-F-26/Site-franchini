# Déploiement Vercel pour Site Franchini

Ce document explique comment configurer et déployer le site Jekyll sur Vercel.

## Prérequis

- Compte Vercel
- Dépôt Git (GitHub, GitLab ou Bitbucket)
- Node.js 18.x ou supérieur
- Ruby 3.2.x
- Bundler 2.0 ou supérieur

## Configuration requise

### Fichiers de configuration

1. **`vercel.json`** : Configuration principale pour Vercel
   - Définit le script de build et les variables d'environnement
   - Configure les routes et les en-têtes HTTP

2. **`vercel-build.sh`** : Script de build personnalisé
   - Gère l'installation des dépendances
   - Exécute la construction du site Jekyll
   - Vérifie les versions des outils
   - Valide la sortie du build

3. **`vercel-build.config.js`** : Configuration centralisée
   - Définit les versions requises des outils
   - Configure les options de build pour Jekyll et Bundler
   - Liste les fichiers critiques à vérifier

4. **`.vercelignore`** : Fichiers à ignorer lors du déploiement
   - Exclut les fichiers inutiles (cache, logs, etc.)
   - Améliore les performances du déploiement

## Variables d'environnement

Les variables suivantes doivent être configurées dans les paramètres du projet Vercel :

- `NODE_VERSION` : Version de Node.js (par défaut : 18.x)
- `RUBY_VERSION` : Version de Ruby (par défaut : 3.2.2)
- `JEKYLL_ENV` : Environnement Jekyll (par défaut : production)
- `BUNDLE_PATH` : Chemin d'installation des gems (par défaut : /var/task/vendor/bundle)

## Processus de déploiement

1. **Installation des dépendances** :
   - Node.js (via `npm install`)
   - Ruby (via `bundle install`)

2. **Construction du site** :
   - Nettoyage du cache Jekyll
   - Construction avec les options définies
   - Tentative de secours en mode sûr si échec

3. **Validation** :
   - Vérification de l'existence des fichiers critiques
   - Vérification de la taille du répertoire de sortie

## Dépannage

### Erreurs courantes

1. **Échec de l'installation des dépendances Ruby** :
   - Vérifiez la version de Ruby
   - Essayez de supprimer le Gemfile.lock et réinstallez

2. **Problèmes de permissions** :
   - Assurez-vous que `vercel-build.sh` est exécutable
   - Utilisez `chmod +x vercel-build.sh` si nécessaire

3. **Fichiers manquants après le build** :
   - Vérifiez les chemins dans `_config.yml`
   - Assurez-vous que tous les fichiers statiques sont dans le bon dossier

### Journaux de débogage

Les journaux de build complets sont disponibles dans l'interface Vercel. Pour un débogage local :

```bash
# Mode verbeux
VERCEL_DEBUG=1 vercel

# Afficher les logs détaillés
vercel logs <url-du-projet>
```

## Performances

Pour optimiser les performances de déploiement :

- Utilisez le cache de Vercel
- Évitez de versionner les dépendances
- Utilisez `.vercelignore` pour exclure les fichiers inutiles

## Sécurité

- Ne stockez jamais d'informations sensibles dans le code source
- Utilisez les secrets Vercel pour les données sensibles
- Vérifiez régulièrement les vulnérabilités des dépendances

## Support

Pour toute question ou problème, veuillez ouvrir une issue dans le dépôt du projet.
