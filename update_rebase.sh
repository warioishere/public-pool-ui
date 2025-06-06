#!/bin/bash

echo "Updating master branch..."
git checkout master
git fetch upstream
git reset --hard upstream/master

echo "Switching to blitzpool-master branch..."
git checkout blitzpool-master

echo "Rebasing blitzpool-customizations onto master..."
git rebase master

echo "Done!"
