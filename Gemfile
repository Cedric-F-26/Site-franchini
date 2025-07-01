source "https://rubygems.org" do
  # This will help ensure the proper Jekyll version is running.
  # Happy Jekylling!
  gem "jekyll", "~> 4.3.3"
  gem "jekyll-theme-minimal", "~> 0.2.0"
  gem "webrick", "~> 1.8"
  gem "kramdown-parser-gfm", "~> 1.1"
end

# Explicitly specify the platforms
ruby ">= 2.6.0"

# Add additional gems here if needed

# --- Plugins de contenu ---
gem 'jekyll-feed', '~> 0.17.0'
gem 'jekyll-seo-tag', '~> 2.8.0'
gem 'jekyll-sitemap', '~> 1.4.0'
gem 'jekyll-paginate-v2', '~> 3.0.0'
gem 'jekyll-redirect-from', '~> 0.16.0'

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
  gem 'ffi', '~> 1.16.3'
end

# Dépendances uniquement pour le développement local
group :development do
  gem 'rb-inotify', '~> 0.10.1', require: false # Pour la surveillance des fichiers
  gem 'jekyll-watch', '~> 2.2.1'
  gem 'html-proofer', '~> 3.19.0'
end
