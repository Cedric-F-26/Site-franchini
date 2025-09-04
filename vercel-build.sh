#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "--- Installing Ruby Dependencies ---"
bundle install --jobs 4 --retry 3

echo "--- Installing Node.js Dependencies ---"
npm install

echo "--- Building Jekyll Site ---"
bundle exec jekyll build

echo "--- Build Complete ---"
