source "https://rubygems.org"

ruby '2.7.7'

gem 'jekyll', '~> 3.8.7'
gem 'webrick', '~> 1.8.1'

# --- Plugins de contenu ---
gem 'jekyll-feed', '~> 0.17.0'
gem 'jekyll-seo-tag', '~> 2.8.0'
gem 'jekyll-sitemap', '~> 1.4.0'
gem 'jekyll-paginate-v2', '~> 3.0.0'
gem 'jekyll-redirect-from', '~> 0.16.0'

# --- Gestion des assets ---
gem 'jekyll-assets', '~> 3.0.12'
gem 'jekyll-minifier', '~> 0.1.10'
gem 'jekyll-include-cache', '~> 0.2.1'

# --- Outils de build ---
gem 'kramdown', '~> 2.4.0'
gem 'kramdown-parser-gfm', '~> 1.1.0'
gem 'sass-embedded', '~> 1.69.5'

# Dépendances pour les plugins ci-dessus
group :jekyll_plugins do
  gem 'uglifier', '~> 4.2.0'
  gem 'htmlcompressor', '~> 0.4.0'
end

# Dépendances spécifiques à certaines plateformes
platforms :ruby do
  gem 'ffi', '~> 1.15.5'
end

# Dépendances uniquement pour le développement local
group :development do
  gem 'rb-inotify', '~> 0.10.1', require: false # Pour la surveillance des fichiers
  gem 'jekyll-watch', '~> 2.2.1'
  gem 'html-proofer', '~> 3.19.0'
end
