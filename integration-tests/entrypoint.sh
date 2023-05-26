#!/bin/bash

if [ -d "/e2e" ]; then
  cd /e2e
  npm i
  npx cypress install
else
  cd /tmp/e2e
fi

npm run cy:run

if [ -d "/e2e/cypress" ]; then
  chmod -R a+rwx /e2e/cypress
  cp -a /e2e/cypress/* /tmp/artifacts
else
  cp -r /tmp/e2e/cypress/* /tmp/artifacts
fi