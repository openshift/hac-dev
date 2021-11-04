#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    npm install
fi

npm run build
