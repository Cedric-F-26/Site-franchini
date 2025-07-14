# Procédure de Lancement du Serveur de Développement (Windows)

Ce document explique comment lancer le serveur de développement Jekyll pour ce projet sur un environnement Windows, en particulier si vous rencontrez des problèmes avec les commandes standards.

## Contexte

Sous Windows, il est fréquent que les chemins vers les exécutables Ruby (comme `ruby.exe`, `bundle.exe`, `jekyll.exe`) ne soient pas automatiquement ajoutés à la variable d'environnement `PATH` de votre système ou de votre terminal.

Cela peut provoquer des erreurs comme `commande non reconnue` lorsque vous essayez de lancer `bundle exec jekyll serve`.

## Solution

La solution la plus fiable est de lancer le serveur en utilisant une commande qui spécifie explicitement le chemin vers votre installation de Ruby avant d'exécuter la commande `bundle`.

### Étapes

1.  **Ouvrez un terminal PowerShell** à la racine de votre projet (`Site-franchini`).
    *Vous pouvez faire cela en faisant un clic droit dans le dossier dans l'explorateur de fichiers et en choisissant "Ouvrir dans le terminal" ou "Ouvrir une fenêtre PowerShell ici".*

2.  **Copiez et collez la commande suivante** dans le terminal, puis appuyez sur Entrée :

    ```powershell
    $env:PATH = 'C:\Ruby34-x64\bin;' + $env:PATH; bundle exec jekyll serve
    ```

### Explication de la commande

-   `$env:PATH = 'C:\Ruby34-x64\bin;' + $env:PATH;` : Cette partie de la commande ajoute temporairement (uniquement pour cette session de terminal) le dossier `bin` de votre installation Ruby au `PATH`. Cela permet au terminal de trouver les exécutables `ruby.exe` et `bundle.exe`.
    -   **Note :** Si vous avez installé Ruby dans un autre dossier, remplacez `C:\Ruby34-x64` par le chemin correct de votre installation.
-   `bundle exec jekyll serve` : C'est la commande standard pour lancer le serveur Jekyll en utilisant les dépendances spécifiées dans le `Gemfile` du projet.

Une fois la commande lancée, le serveur devrait démarrer et vous pourrez accéder au site localement, généralement à l'adresse `http://localhost:4000`.
