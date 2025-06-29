source "https://rubygems.org"

# Définir la version de Ruby requise
ruby '2.7.7'

# Version de Jekyll
gem 'jekyll', '~> 4.3.3'

# Gems principales
gem 'webrick', '~> 1.8.1'  # Nécessaire pour Ruby 3.0+
gem 'kramdown', '~> 2.4.0'  # Moteur de rendu Markdown
gem 'kramdown-parser-gfm', '~> 1.1.0'  # Support GitHub Flavored Markdown

# Plugins Jekyll
gem 'jekyll-feed', '~> 0.17.0'  # Flux RSS
gem 'jekyll-seo-tag', '~> 2.8.0'  # Balises SEO
gem 'jekyll-sitemap', '~> 1.4.0'  # Sitemap XML
gem 'jekyll-minifier', '~> 0.1.10'  # Minification des assets
gem 'jekyll-include-cache', '~> 0.2.1'  # Cache pour les includes
gem 'jekyll-compose', '~> 0.12.0', group: [:jekyll_plugins]  # Commandes CLI

# Gestion des assets
gem 'jekyll-assets', '~> 3.2.1'  # Pipeline d'assets

# Utilisation de Dart Sass via le plugin officiel Jekyll
gem 'sass-embedded', '~> 1.69.5'  # Alternative plus rapide à Ruby Sass

group :jekyll_plugins do
  # Outils de minification
  gem 'uglifier', '~> 4.2.0'  # Minification JS
  gem 'htmlcompressor', '~> 0.4.0'  # Minification HTML
  gem 'json-minify', '~> 0.0.3'  # Minification JSON
  gem 'cssminify2', '~> 2.0.1'  # Minification CSS
  
  # Optimisation des images (optionnel)
  gem 'image_optim', '~> 0.31.0', platform: :ruby
  gem 'image_optim_pack', '~> 0.7.0', platform: :ruby
  
  # Autres plugins utiles
  gem 'jekyll-paginate-v2', '~> 3.0.0'  # Pagination améliorée
  gem 'jekyll-redirect-from', '~> 0.16.0'  # Redirections
end

# Configuration de la plateforme (nécessaire pour certaines dépendances)
platforms :ruby do
  # Dépendances spécifiques à Linux/Unix
  gem 'ffi', '~> 1.15.5'  # Nécessaire pour certaines extensions natives
  gem 'rb-inotify', '~> 0.10.1'  # Surveillance des fichiers
end

# Configuration de Bundler
Bundler.require(*[:default, :jekyll_plugins])

# Configuration spécifique à l'environnement
if ENV['JEKYLL_ENV'] == 'development'
  # Dépendances de développement
  gem 'html-proofer', '~> 3.19.0', group: :development
  gem 'jekyll-watch', '~> 2.2.1', group: :development
end
