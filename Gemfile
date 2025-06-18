# Configuration du fichier Gemfile pour le site Franchini
# Ce fichier gère les dépendances Ruby nécessaires au projet

# Source des gems (RubyGems.org)
source "https://rubygems.org"

# Version minimale de Ruby requise
ruby '>= 3.1.0', '< 4.0'

# Gestion des dépendances pour Jekyll
gem "jekyll", "~> 4.3.3"

# Plugins essentiels
group :jekyll_plugins do
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-paginate-v2", "~> 3.0"
  gem "jekyll-include-cache", "~> 0.2"
  gem "jekyll-minifier", "~> 0.1"
end

# Pour le développement local
group :development do
  gem "webrick", "~> 1.8"
  gem "jekyll-watch", "~> 2.2"
  gem "wdm", ">= 0.1.0" if Gem.win_platform?
  gem "html-proofer", "~> 5.0"
  gem "rubocop-jekyll", "~> 0.13"
  gem "jekyll-livereload", "~> 0.4"
  gem "pry-byebug", "~> 3.10"
end

# Configuration spécifique à Windows
platforms :mingw, :x64_mingw, :mswin do
  gem "wdm", ">= 0.1.0"
  gem "tzinfo", "~> 2.0"
  gem "tzinfo-data", "~> 1.2023"
end

# Amélioration des performances
group :performance do
  gem "http_parser.rb", "~> 0.8.0" if RUBY_PLATFORM =~ /x86_64-linux/
  gem "jekyll-minifier", "~> 0.1"
  gem "jekyll-assets", "~> 3.4"
end

# Dépendances optionnelles
gem "sassc", "~> 2.4"
gem "ffi", "~> 1.15", ">= 1.15.5"

# Configuration pour Vercel
if ENV['VERCEL']
  gem 'jekyll-vercel', '~> 0.2.0'
end
