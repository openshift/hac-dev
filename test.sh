#!/bin/bash
set -euo pipefail

JOB_TYPE=${JOB_TYPE:-"local"}
REPO_ROOT=$(git rev-parse --show-toplevel)
CI_SERVER_URL=https://prow.svc.ci.openshift.org/view/gcs/origin-ci-test
if [ ! -d node_modules ]; then
    npm install
fi
GIT_BRANCH=${GIT_BRANCH:-}

ENV_BRANCH=$(sed "s/origin\///" <<< "$GIT_BRANCH")
if [[ "${ENV_BRANCH}" = "master" ||  "${ENV_BRANCH}" = "main" ]]; then
    BETA=true
fi

if [[ "${JOB_TYPE}" == "presubmit" ]]; then
       echo "detected PR code coverage job for #${PULL_NUMBER}"
       REF_FLAGS="-P ${PULL_NUMBER} -C ${PULL_PULL_SHA}"
       JOB_LINK="${CI_SERVER_URL}/pr-logs/pull/${REPO_OWNER}_${REPO_NAME}/${PULL_NUMBER}/${JOB_NAME}/${BUILD_ID}"
elif [[ "${JOB_TYPE}" == "postsubmit" || "${JOB_TYPE}" == "periodic" ]]; then
       #echo "detected branch code coverage job for ${PULL_BASE_REF}"
       #REF_FLAGS="-B ${PULL_BASE_REF} -C ${PULL_BASE_SHA}"
       REF_FLAGS=""
       REPO_OWNER="openshift"
       REPO_NAME="hac-dev"
       JOB_LINK="${CI_SERVER_URL}/logs/${JOB_NAME}/${BUILD_ID}"
else
       echo "Coverage not enabled on Job Type :${JOB_TYPE}"
       npm run verify
fi

if [[ "${JOB_TYPE}" != "local" ]]; then
    curl -Os https://uploader.codecov.io/latest/linux/codecov
    chmod +x codecov
    npm run verify
    ./codecov -t ${CODECOV_TOKEN} -r "${REPO_OWNER}/${REPO_NAME}" ${REF_FLAGS} --dir ./coverage
fi
