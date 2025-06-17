source "https://rubygems.org"

# Version minimale de Ruby requise
ruby '>= 2.7.0', '< 4.0'

# Gestion des dépendances pour Jekyll
gem "jekyll", "~> 4.3.0"

# Plugins essentiels
group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-feed"
  gem "jekyll-paginate-v2"
end

# Pour le développement local
group :development do
  gem "webrick"
  gem "jekyll-watch"
  gem "wdm", ">= 0.1.0" if Gem.win_platform?
  gem "html-proofer"
  gem "rubocop-jekyll"
end

# Configuration spécifique à Windows
platforms :mingw, :x64_mingw, :mswin do
  gem "wdm", ">= 0.1.0"
  gem "tzinfo"
  gem "tzinfo-data"
end

# Amélioration des performances
install_if -> { RUBY_PLATFORM =~ /x86_64-linux/ } do
  gem "http_parser.rb", "~> 0.6.0"
end
