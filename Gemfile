source "https://rubygems.org"
ruby '>= 2.7.0'

gem "jekyll", "~> 4.3.3"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-minifier"
  gem "webrick"
  gem "autoprefixer-rails"
  gem "uglifier"
end

# Pour Windows
platforms :mingw, :x64_mingw, :mswin do
  gem "tzinfo-data"
end

# Configuration pour Vercel
if ENV['VERCEL']
  gem 'jekyll-vercel', '~> 0.2.0'
end
