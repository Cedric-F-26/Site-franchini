# Guide de contribution

Merci de contribuer au projet Franchini ! Voici comment vous pouvez aider à améliorer ce projet.

## Code de conduite

En participant à ce projet, vous acceptez de respecter le code de conduite du projet.

## Comment contribuer

1. **Signaler un bug**
   - Vérifiez d'abord si le bug n'a pas déjà été signalé en parcourant les [issues](https://github.com/votre-utilisateur/site-franchini/issues).
   - Si vous ne trouvez pas d'issue existante, créez-en une nouvelle avec une description claire et détaillée.

2. **Proposer une amélioration**
   - Créez une issue pour discuter de votre proposition avant de commencer à coder.
   - Une fois validée, vous pouvez soumettre une pull request.

## Processus de développement

1. **Forkez le dépôt** et créez une branche pour votre fonctionnalité :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Installez les dépendances** :
   ```bash
   bundle install
   npm install
   ```

3. **Faites vos modifications** en suivant les conventions de code du projet.

4. **Vérifiez votre code** avant de le soumettre :
   ```bash
   npm run lint
   npm test
   ```

5. **Commitez vos modifications** avec un message clair et descriptif :
   ```bash
   git commit -m "Ajout: Nouvelle fonctionnalité pour [décrire la fonctionnalité]"
   ```

6. **Poussez vos modifications** vers votre fork :
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

7. **Ouvrez une Pull Request** vers la branche `main` du dépôt principal.

## Conventions de code

### JavaScript
- Utilisez des fonctions nommées plutôt que des fonctions anonymes
- Utilisez `const` et `let` au lieu de `var`
- Utilisez des templates strings pour les chaînes complexes
- Documentez les fonctions avec des commentaires JSDoc

### CSS/SCSS
- Suivez la méthodologie BEM pour le nommage des classes
- Utilisez des variables CSS pour les couleurs et les espacements
- Évitez les sélecteurs trop spécifiques
- Commentez les sections importantes

### HTML
- Utilisez une indentation cohérente (2 espaces)
- Utilisez des attributs HTML5 valides
- Assurez-vous que le code est accessible (aria-labels, rôles, etc.)

## Tests

Exécutez les tests avant de soumettre votre code :

```bash
npm test
```

## Déploiement

Le déploiement est automatisé via Vercel. Chaque push sur la branche `main` déclenche un nouveau déploiement.

## Questions ?

Si vous avez des questions, n'hésitez pas à ouvrir une issue ou à contacter l'équipe de développement.
