#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    npm install
fi

# Disabling code coverage for now because of CI issues.
# curl -Os https://uploader.codecov.io/latest/linux/codecov

# chmod +x codecov

npm run verify
# ./codecov --dir ./coverage

