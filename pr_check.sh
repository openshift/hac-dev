#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="hac-dev"
export IMAGE="quay.io/cloudservices/hac-dev-frontend"
export APP_ROOT=$(pwd)
export WORKSPACE=${WORKSPACE:-$APP_ROOT} # if running in jenkins, use the build's workspace
export NODE_BUILD_VERSION=14
IMAGE="quay.io/cloudservices/hac-dev-frontend"
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
IQE_PLUGINS="hac_dev"
IQE_MARKER_EXPRESSION="smoke"
IQE_FILTER_EXPRESSION=""

# Build and push to quay
set -exv
# source is preferred to | bash -s in this case to avoid a subshell
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?

# Get bonfire helper scripts and python venv. Set GIT_COMMIT and IMAGE_TAG
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

# Note: PoC will be cleaned up with Bonfire changes
# Get a namespace in the eph cluster and set vars accordingly
NAMESPACE=$(bonfire namespace reserve)
ENV_NAME=env-${NAMESPACE}
oc project ${NAMESPACE}
HOSTNAME=$(oc get feenv ${ENV_NAME} -o json | jq ".spec.hostname" | tr -d '"')

# Temp: setup proxy and patch SSO for devsandbox
oc patch feenv ${ENV_NAME} --type merge  -p '{"spec":{"sso": "'$HAC_KC_SSO_URL'" }}'
oc process -f tmp/hac-proxy.yaml -n ${NAMESPACE} -p NAMESPACE=${NAMESPACE} -p ENV_NAME=${ENV_NAME} -p HOSTNAME=${HOSTNAME} | oc create -f -

# Deploy hac-dev with PR git ref and mainline hac-core ref
bonfire deploy \
        hac \
        --frontends true \
        --source=appsre \
        --clowd-env ${ENV_NAME} \
        --set-template-ref ${COMPONENT}=${GIT_COMMIT} \
        --set-image-tag ${IMAGE}=${IMAGE_TAG} \
        --namespace ${NAMESPACE}

# Call the keycloak API and add a user
B64_USER=$(oc get secret ${ENV_NAME}-keycloak -o json | jq '.data.username'| tr -d '"')
B64_PASS=$(oc get secret ${ENV_NAME}-keycloak -o json | jq '.data.password' | tr -d '"')
# These ENVs are populated in the Jenkins job by Vault secrets
python tmp/keycloak.py $HAC_KC_SSO_URL $HAC_KC_USERNAME $HAC_KC_PASSWORD $B64_USER $B64_PASS $HAC_KC_REGISTRATION

cd integration-tests
npm install
npm install typescript
cd ..

mkdir -p $WORKSPACE/artifacts

ID="$(id -u):$(id -g)"
COMMON_SETUP="-u $ID \
    -v $WORKSPACE/artifacts:/e2e/cypress:Z \
    -v $PWD/integration-tests:/e2e:Z \
    -v /etc/passwd:/etc/passwd:ro \
    -w /e2e \
    -e CYPRESS_CACHE_FOLDER=/e2e/.cache \
    -e CYPRESS_PR_CHECK=true \
    -e CYPRESS_GH_PR_ID='${ghprbPullId}' \
    -e CYPRESS_GH_PR_LINK=${ghprbPullLink} \
    -e CYPRESS_HAC_BASE_URL=https://${HOSTNAME}/hac/stonesoup \
    -e CYPRESS_USERNAME=`echo ${B64_USER} | base64 -d` \
    -e CYPRESS_PASSWORD=`echo ${B64_PASS} | base64 -d`"
TEST_IMAGE="quay.io/hacdev/hac-tests:latest"

set +e
TEST_RUN=0

docker run ${COMMON_SETUP} \
    -e CYPRESS_GH_TOKEN=${CYPRESS_GH_TOKEN} \
    -e CYPRESS_QUAY_TOKEN=${CYPRESS_QUAY_TOKEN} \
    -e CYPRESS_RP_TOKEN=${CYPRESS_RP_HAC} \
    ${TEST_IMAGE} \
    bash -c "startcypress run -e GH_PR_TITLE='${ghprbPullTitle}'" || TEST_RUN=1

docker run ${COMMON_SETUP} \
    -e CYPRESS_GH_PASSWORD=${CYPRESS_GH_PASSWORD} \
    -e CYPRESS_RP_TOKEN=${CYPRESS_RP_HAC} \
    ${TEST_IMAGE} \
    bash -c "startcypress run -e configFile=hac-dev-experimental" || TEST_RUN=2

bonfire namespace release ${NAMESPACE}

# teardown_docker
exit $TEST_RUN
