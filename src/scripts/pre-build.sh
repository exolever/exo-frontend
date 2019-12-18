#!/bin/sh
set -e

echo "Installing requirements..."
apk add --no-cache curl python

echo "Stopping current running pipelines (mutex)..."
curl -s "https://59a7w4lqt7.execute-api.us-east-1.amazonaws.com/prod/stopper?key=WveH2wB4s7u79pTm&repo_slug=$BITBUCKET_REPO_SLUG&source_branch=$BITBUCKET_BRANCH&commit=$BITBUCKET_COMMIT"

echo "Install Packages using ci instead of install..."
# npm ci --no-audit
npm install

# Copy regular ts.dist to both .ts and .prod.ts (NON TAG)"
echo "Copying dist -> ts..."
cp src/environments/environment.ts.dist src/environments/environment.ts
cp src/environments/environment.ts.dist src/environments/environment.prod.ts

# Only copy prod.ts in release (TAG)..."
if [ ! -z "$BITBUCKET_TAG" ]; then cp src/environments/environment.prod.ts.dist src/environments/environment.prod.ts; fi

echo "Copying and modifying files for release..."
sed -i "s/<SOURCE_NAME>/$SOURCE_NAME/" src/index.html
sed -i "s/<SOURCE_NAME>/$SOURCE_NAME/" src/environments/environment.ts
sed -i "s/<SOURCE_NAME>/$SOURCE_NAME/" src/environments/environment.prod.ts
