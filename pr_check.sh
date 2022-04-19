#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="hac-dev"
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

# Get bonfire helper scripts and python venv
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

# Get a namespace in the eph cluster
NAMESPACE=$(bonfire namespace reserve)
ENV_NAME=fenv-${NAMESPACE}
# setup temp env, bundle, and proxy
oc process -f tmp/hac-env.yaml -p ENV_NAME=${ENV_NAME} -p HOSTNAME=${ENV_NAME}.apps.c-rh-c-eph.8p0c.p1.openshiftapps.com | oc apply -f -
oc process -f tmp/hac-nav.yaml -p ENV_NAME=${ENV_NAME} | oc apply -f -
oc process -f tmp/hac-proxy.yaml -p NAMESPACE=${NAMESPACE} -p ENV_NAME=${ENV_NAME} | oc apply -f -

# Deploys hac-dev with PR git ref and mainline hac-core ref
bonfire deploy \ 
        hac \ 
        --frontends true \ 
        --source=appsre \ 
        --set-tempalte-ref ${COMPONENT}=${GIT_COMMIT}  \ 
        --set-image-tag ${IMAGE} \ 
        --namespace ${NAMESPACE}

# Call the keycloak API and add a user?

# Stubbed out for now
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

# teardown_docker
exit $BUILD_RESULTS
