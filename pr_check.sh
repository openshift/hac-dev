#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="hac-dev"
export APP_ROOT=$(pwd)
# Because IMAGE_TAG from bonfire is going to prepend "pr-" we override it.
export TAG=$(git rev-parse --short=7 HEAD)
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
        --set-template-ref ${COMPONENT}=${GIT_COMMIT} \
        --set-image-tag ${IMAGE}=${TAG} \
        -p hac-dev/ENV_NAME=${ENV_NAME} \
        -p hac/ENV_NAME=${ENV_NAME} \
        --namespace ${NAMESPACE}

# Call the keycloak API and add a user
B64_USER=$(oc get secret ${ENV_NAME}-keycloak -o json | jq '.data.username'| tr -d '"')
B64_PASS=$(oc get secret ${ENV_NAME}-keycloak -o json | jq '.data.password' | tr -d '"')
# These ENVs are populated in the Jenkins job by Vault secrets
python tmp/keycloak.py $HAC_KC_SSO_URL $HAC_KC_USERNAME $HAC_KC_PASSWORD $B64_USER $B64_PASS $HAC_KC_REGISTRATION


# Stubbed out for now
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

# teardown_docker
exit $BUILD_RESULTS
