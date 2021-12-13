#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    npm install
fi

curl -Os https://uploader.codecov.io/latest/linux/codecov

chmod +x codecov

npm run verify
./codecov -t ${CODECOV_TOKEN} --dir ./coverage

