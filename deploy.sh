#!/usr/bin/env sh

# abort on errors
set -e

#build
npm run build

#navigate into the build output derictiry
cd dist

#place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying
git init
git checkout -B main
git add -A
git commit -m 'deploy'


cd -