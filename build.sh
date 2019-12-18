


case $1 in

  linter)

    # Linter
    export PATH="${PATH}:node_modules/.bin/"
    ng lint openexo --format=verbose

    ;;

  tests)

    # Tests
    export PATH="${PATH}:node_modules/.bin/"
    export CHROME_BIN=/usr/bin/chromium-browser
    export TZ=Europe/Madrid
    # apk add --no-cache tzdata chromium
    ng test --browsers=ChromeHeadless --watch=false --code-coverage --source-map=false

    ;;

  build)

    if [ "$SOURCE_BRANCH" == "master" ]; then

      # build-master
      unset NPM_CONFIG_USER
      npm install @sentry/cli
      export PATH="${PATH}:node_modules/.bin/"
      npm run build:highMemoMaster ---deploy-url=https://cdn.openexo.com/bundles/exo-frontend/$SOURCE_NAME/
      export SENTRY_ORG=openexo
      export SENTRY_PROJECT=frontend
      export SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
      sentry-cli releases new $SOURCE_NAME
      sentry-cli releases files $SOURCE_NAME upload-sourcemaps --url-prefix "https://cdn.openexo.com/bundles/exo-frontend/$SOURCE_NAME/" --ext ts --ext map --ext js dist/
      sentry-cli releases finalize $SOURCE_NAME

    else

      # build
      unset NPM_CONFIG_USER
      export PATH="${PATH}:node_modules/.bin/"
      npm run build:highMemo ---deploy-url=https://cdn.openexo.com/bundles/exo-frontend/$SOURCE_NAME/

    fi

    # build-custom-elements
    unset NPM_CONFIG_USER
    export PATH="${PATH}:node_modules/.bin/"
    npm run build-custom-elements

    # s3

    # Activate this for invalidate on tag
    if [ ! -z "$SOURCE_TAG" ]; then export INVALIDATE=--cf-invalidate; fi

    s3cmd $INVALIDATE \
      --verbose \
      --no-preserve \
      --access_key=$AWS_KEY \
      --secret_key=$AWS_SECRET \
      --force \
      --delete-removed \
      --human-readable-sizes \
      --stop-on-error \
      --acl-public \
      --recursive \
      --no-mime-magic \
      --guess-mime-type \
      sync dist/ \
      s3://openexo/bundles/exo-frontend/$SOURCE_NAME/

    ;;

  *)
    echo -n "unknown"
    ;;
esac

