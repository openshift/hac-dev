#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    yarn install
fi

yarn build
