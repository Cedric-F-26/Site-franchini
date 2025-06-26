# Guide de déploiement Vercel

Ce guide explique comment déployer le site Jekyll sur Vercel.

## Prérequis

- Un compte [Vercel](https://vercel.com)
- Un dépôt Git (GitHub, GitLab ou Bitbucket)
- Ruby 2.5.0 ou supérieur
- Node.js 14.x ou supérieur

## Configuration requise

### Fichier de configuration Vercel

Le fichier `vercel.json` est configuré pour déployer un site Jekyll avec les paramètres suivants :

- Utilisation du builder `@vercel/static`
- Dossier de sortie : `_site`
- Routes configurées pour le SPA (Single Page Application)

### Variables d'environnement

Aucune variable d'environnement n'est requise pour le moment.

## Déploiement manuel

1. Poussez votre code sur votre dépôt Git
2. Connectez-vous à [Vercel](https://vercel.com)
3. Cliquez sur "New Project"
4. Importez votre dépôt Git
5. Vérifiez les paramètres de build :
   - Framework: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `_site`
6. Cliquez sur "Deploy"

## Déploiement automatique

Le déploiement automatique est configuré via le fichier `vercel.json`. À chaque push sur la branche principale, Vercel déclenchera un nouveau déploiement.

## Dépannage

### Erreurs courantes

1. **Échec de l'installation de Ruby**
   - Assurez-vous que Ruby est installé sur votre machine de développement
   - Vérifiez que Ruby est dans votre PATH

2. **Échec de l'installation des gems**
   - Exécutez `bundle install` localement pour vérifier les dépendances manquantes
   - Vérifiez que toutes les gems nécessaires sont listées dans le `Gemfile`

3. **Erreurs de build Jekyll**
   - Exécutez `bundle exec jekyll build` localement pour identifier les erreurs
   - Vérifiez les logs de build dans l'interface Vercel pour plus de détails

### Logs de build

Les logs de build détaillés sont disponibles dans l'interface Vercel sous l'onglet "Deployments".

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.
