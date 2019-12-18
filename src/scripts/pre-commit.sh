#!/bin/bash

diffs="$(git diff --staged --name-only src/assets/i18n/en.json)"

if [[ $diffs = 'src/assets/i18n/en.json' ]]; then
  npm run sort:en
  echo "Adding the languages en.json to commit"
  git add .
fi

exit 0;
