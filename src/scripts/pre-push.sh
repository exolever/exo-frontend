#!/bin/bash

pass=true #boolean to know if test passed or failed.
RED='\033[1;31m'
GREEN='\033[0;32m'
COLOR_RESET='\033[0m'

echo "Running tests:"
runtest=$(ng test --code-coverage --watch=false --source-map=false)
retcode=$? # This will be 1 or 0 if ng test was fine or fail.

if [ $retcode != 0 ]; then
  printf "\n${RED}Test failed. Try again!:${COLOR_RESET}"
  echo "$runtest\n" # Print the errors
  pass=false
else
  printf "${GREEN}Test passed. Nice Job!.${COLOR_RESET}\n"
fi

echo "Running linter:"
runlint=$(ng lint openexo --format=json)
lintcode=$?

if [ $lintcode != 0 ]; then
  printf "\n${RED}Lint failed. Try again!:${COLOR_RESET}"
  echo "$runlint\n" # Print the errors
  pass=false
else
  printf "${GREEN}Lint passed. Nice Job!.${COLOR_RESET}\n"
fi

# If there were no failures, it is good to push
if $pass; then
  exit 0
fi

exit 1

# git push ... --no-verify // Skip prepush hook
