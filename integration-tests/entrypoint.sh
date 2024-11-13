#!/bin/bash
args="-b chrome";
for var in "$@"
do
  args="$args $var"
done

if [ -d "/e2e" ]; then
  cd /e2e
  npm i
  npx cypress install
  chmod -R a+rwx ../e2e 
else
  cd /tmp/e2e
fi

npx cypress run $args

if [ -d "/e2e/cypress" ]; then
  cp -a /e2e/cypress/* /tmp/artifacts
  chmod -R a+rwx /tmp/artifacts
  chmod -R a+rwx /e2e/cypress
else
  cp -a /tmp/e2e/cypress/* /tmp/artifacts
fi