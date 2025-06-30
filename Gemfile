source "https://rubygems.org"

ruby '2.7.7'

gem 'jekyll', '~> 4.3.3'
gem 'webrick', '~> 1.8.1'

# Plugins de contenu
gem 'jekyll-feed', '~> 0.17.0'
gem 'jekyll-seo-tag', '~> 2.8.0'
gem 'jekyll-sitemap', '~> 1.4.0'
gem 'jekyll-paginate-v2', '~> 3.0.0'
gem 'jekyll-redirect-from', '~> 0.16.0'
gem 'jekyll-compose', '~> 0.12.0', group: [:jekyll_plugins]

# Plugins de gestion d'assets
gem 'jekyll-assets', '~> 3.2.1'
gem 'jekyll-minifier', '~> 0.1.10'
gem 'jekyll-include-cache', '~> 0.2.1'

# Moteur Markdown
gem 'kramdown', '~> 2.4.0'
gem 'kramdown-parser-gfm', '~> 1.1.0'

# Processeur SASS
gem 'sass-embedded', '~> 1.69.5'

group :jekyll_plugins do
  gem 'uglifier', '~> 4.2.0'
  gem 'htmlcompressor', '~> 0.4.0'
end

platforms :ruby do
  gem 'ffi', '~> 1.15.5'
  gem 'rb-inotify', '~> 0.10.1'
end

if ENV['JEKYLL_ENV'] == 'development'
  gem 'html-proofer', '~> 3.19.0', group: :development
  gem 'jekyll-watch', '~> 2.2.1', group: :development
end