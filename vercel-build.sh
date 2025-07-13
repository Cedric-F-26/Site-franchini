#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "=== Starting Jekyll Build ==="

# Set the environment for production
export JEKYLL_ENV=production

# Display key versions for debugging
echo "--- Versions ---"
ruby -v
bundle -v
node -v
echo "----------------"

echo "--- Gem List ---"
bundle list
echo "----------------"

# Install Ruby gems
echo "--- Installing Gems ---"
bundle install
echo "-------------------"

# Build the Jekyll site
echo "--- Building Site ---"
bundle exec jekyll build --trace

# Verify the output directory
echo "--- Verifying Output ---"
if [ -d "_site" ]; then
  echo "Build successful. _site directory created."
  echo "Contents of _site:"
  ls -lR _site
else
  echo "Build failed: _site directory not found."
  exit 1
fi

echo "=== Build Complete ==="
