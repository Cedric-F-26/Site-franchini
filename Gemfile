source "https://rubygems.org"

# Core Jekyll
gem "jekyll", "~> 4.3"

# webrick est automatiquement ajouté par Vercel
# gem "webrick", "~> 1.8"

# Plugins Jekyll
gem "jekyll-assets", "~> 4.0" # Mise à jour pour Jekyll 4.x
gem "html-proofer", "~> 5.0"
gem "mini_racer", "~> 0.6.2"

# Pour le développement local
if ENV['JEKYLL_ENV'] == 'development'
  group :jekyll_plugins do
    gem "jekyll-feed"
    gem "jekyll-seo-tag"
    gem "jekyll-sitemap"
    gem "jekyll-minifier"
    gem "autoprefixer-rails"
    gem "uglifier"
    gem "sassc"
  end

  # Pour Windows
  platforms :mingw, :x64_mingw, :mswin do
    gem "tzinfo-data"
    gem "wdm", "~> 0.1.0"
  end
end
