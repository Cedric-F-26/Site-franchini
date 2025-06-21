# Fichier de configuration Rack pour Vercel

# Charger Bundler
require 'bundler/setup'
Bundler.require

# Désactiver la journalisation détaillée en production
configure :production do
  set :environment, :production
  set :logging, false
  set :static, true
  set :public_folder, '_site'
end

# Servir les fichiers statiques du dossier _site
use Rack::Static, 
  :urls => ['/'],
  :root => '_site',
  :index => 'index.html',
  :header_rules => [
    [:all, {'Cache-Control' => 'public, max-age=3600'}],
    ['.html', {'Cache-Control' => 'public, max-age=600, must-revalidate'}],
    ['.css', {'Cache-Control' => 'public, max-age=31536000, immutable'}],
    ['.js', {'Cache-Control' => 'public, max-age=31536000, immutable'}],
    ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', {'Cache-Control' => 'public, max-age=31536000, immutable'}],
    ['.woff', '.woff2', '.ttf', '.eot', {'Cache-Control' => 'public, max-age=31536000, immutable'}]
  ]

# Gérer les erreurs 404
error 404 do
  File.read(File.join('_site', '404.html'))
end

# Route par défaut
run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=600, must-revalidate'
    },
    File.open('_site/index.html', File::RDONLY)
  ]
}
