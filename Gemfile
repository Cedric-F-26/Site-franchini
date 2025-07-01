source "https://rubygems.org"

# Spécification de la version de Ruby
ruby ">= 3.0.0"

# Gems principaux
gem "jekyll", "~> 4.3.3"
gem "webrick"

group :jekyll_plugins do
  # Thème
  gem "minima", "~> 2.5"
  
  # Plugins recommandés
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  
  # Markdown
  gem 'kramdown-parser-gfm', '~> 1.1'
end

# --- Gestion des assets ---
# gem 'jekyll-assets'  # Temporairement désactivé car pas encore compatible avec Ruby 3.3.0
gem 'jekyll-minifier', '~> 0.1.10'
gem 'jekyll-include-cache', '~> 0.2.1'

# --- Outils de build ---
gem 'kramdown', '~> 2.4'
gem 'sass-embedded', '~> 1.69'

# Dépendances pour les plugins ci-dessus
group :jekyll_plugins do
  gem 'uglifier', '~> 4.2.0'
  gem 'htmlcompressor', '~> 0.4.0'
end

# Dépendances spécifiques à certaines plateformes
platforms :ruby do
  gem 'ffi', '= 1.15.5'
end

# Dépendances uniquement pour le développement local
group :development do
  gem 'rb-inotify', '~> 0.10.1', require: false # Pour la surveillance des fichiers
  gem 'jekyll-watch', '~> 2.2.1'
  gem 'html-proofer', '~> 3.19.0'
end
