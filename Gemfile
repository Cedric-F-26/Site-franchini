source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`.
#
ruby ">= 2.7.0", "< 3.4.0"

# Gems principaux
gem "jekyll", "~> 4.3.3"
gem "http_parser.rb", "~> 0.6.0" # Ajout pour corriger le build Vercel
gem "webrick"

# Plugins Jekyll
group :jekyll_plugins do
  # Thème
  gem "minima", "~> 2.5"
  
  # Plugins recommandés
  gem "jekyll-feed", "~> 0.17.0"
  gem "jekyll-seo-tag", "~> 2.8.0"
  gem "jekyll-sitemap", "~> 1.4.0"
  
  # Outils de build
  gem "jekyll-sass-converter", "~> 3.0"
  gem "kramdown", "~> 2.4.0"
  gem "kramdown-parser-gfm", "~> 1.1.0"
  
  # Minification
  gem "jekyll-minifier", "~> 0.1.10"
  gem "uglifier", "~> 4.2.0"
  gem "htmlcompressor", "~> 0.4.0"
  
  # Autres fonctionnalités
  gem "jekyll-include-cache", "~> 0.2.1"
  gem "jekyll-redirect-from", "~> 0.16.0"
  
  # Pour le développement local
  gem "jekyll-watch", "~> 2.2.1"
  gem "html-proofer", "~> 3.19.0", group: :development
  gem "rb-inotify", "~> 0.10.1", group: :development, require: false
end
