source "https://rubygems.org"
ruby '>= 2.7.0'

# Core Jekyll
gem "jekyll", "~> 4.3.3"
gem "webrick"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-minifier"
  gem "autoprefixer-rails"
  gem "uglifier"
  gem "jekyll-assets"
  gem "sassc"
end

# Pour Windows
platforms :mingw, :x64_mingw, :mswin do
  gem "tzinfo-data"
  gem "wdm", "~> 0.1.0"
end

# Pour Vercel
group :vercel do
  gem 'vercel-ruby', '~> 0.1.0'
end

# Optimisation pour la production
group :production do
  gem 'html-proofer', '~> 5.0'
  gem 'jekyll-assets', '~> 3.0'
  gem 'mini_racer', '~> 0.6.2'
end
