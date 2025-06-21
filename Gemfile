source "https://rubygems.org"
ruby '>= 2.7.0'

# Core Jekyll
gem "jekyll", "~> 4.3"
gem "webrick", "~> 1.8"

# Plugins Jekyll
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-minifier"
  gem "jekyll-assets", "~> 3.0"
  gem "autoprefixer-rails"
  gem "uglifier"
  gem "sassc"
end

# Pour Windows
platforms :mingw, :x64_mingw, :mswin do
  gem "tzinfo-data"
  gem "wdm", "~> 0.1.0"
end

# Pour Vercel
gem 'vercel-ruby', '~> 0.1.0', group: :vercel

# Optimisation pour la production
gem 'html-proofer', '~> 5.0', group: :production
gem 'mini_racer', '~> 0.6.2', group: :production
