#!/bin/bash

echo "Cloning repository..."
git clone "$GIT_REPO_URL" /home/app/output
echo "Repository cloned successfully"

node script.js