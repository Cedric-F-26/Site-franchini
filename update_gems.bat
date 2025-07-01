@echo off
echo Mise à jour des gems...
bundle update em-websocket
bundle install
bundle exec jekyll build --trace
pause
