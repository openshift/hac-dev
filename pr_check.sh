#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="hac-dev"
export IMAGE="quay.io/cloudservices/hac-dev-frontend"
export APP_ROOT=$(pwd)
export WORKSPACE=${WORKSPACE:-$APP_ROOT} # if running in jenkins, use the build's workspace
export NODE_BUILD_VERSION=16
export ROUTE_PATH=/api/plugins/hac-dev
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

export BONFIRE_REPO_BRANCH='pre-frontend-changes'
BOOTSTRAP_SCRIPT_URL="https://raw.githubusercontent.com/RedHatInsights/cicd-tools/${BONFIRE_REPO_BRANCH}/bootstrap.sh"
curl -s "$BOOTSTRAP_SCRIPT_URL" > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

# Note: PoC will be cleaned up with Bonfire changes
# Get a namespace in the eph cluster and set vars accordingly
NAMESPACE=$(bonfire namespace reserve)
ENV_NAME=env-${NAMESPACE}
oc project ${NAMESPACE}
HOSTNAME=$(oc get feenv ${ENV_NAME} -o json | jq ".spec.hostname" | tr -d '"')

# Temp: setup proxy and patch SSO for devsandbox
oc patch feenv ${ENV_NAME} --type merge  -p '{"spec":{"sso": "'$HAC_KC_SSO_URL'" }}'
oc process -f tmp/hac-proxy.yaml -n ${NAMESPACE} -p NAMESPACE=${NAMESPACE} -p ENV_NAME=${ENV_NAME} -p HOSTNAME=${HOSTNAME} | oc create -f -

# Only deploy necessary frontend dependencies
export BONFIRE_FRONTEND_DEPENDENCIES=chrome-service,insights-chrome

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


CYPRESS_USERNAME="e2e-hac-"`echo ${B64_USER} | base64 -d`
ENCODED_CYPRESS_USERNAME=`echo -n ${CYPRESS_USERNAME} | base64 -w 0`
# These ENVs are populated in the Jenkins job by Vault secrets
python tmp/keycloak.py $HAC_KC_SSO_URL $HAC_KC_USERNAME $HAC_KC_PASSWORD $ENCODED_CYPRESS_USERNAME $B64_PASS $HAC_KC_REGISTRATION
mkdir -p $WORKSPACE/artifacts

PR_TITLE=$(echo ${ghprbPullTitle} | sed -r 's/\s/_/g')
GH_COMMENTBODY=$(echo ${ghprbCommentBody} | sed -r 's/\s/_/g')

COMMON_SETUP="-v $WORKSPACE/artifacts:/tmp/artifacts:Z \
    -v $PWD/integration-tests:/e2e:Z \
    -e CYPRESS_PR_CHECK=true \
    -e CYPRESS_GH_PR_LINK=${ghprbPullLink} \
    -e CYPRESS_HAC_BASE_URL=https://${HOSTNAME}/application-pipeline \
    -e CYPRESS_USERNAME=${CYPRESS_USERNAME} \
    -e CYPRESS_PASSWORD=`echo ${B64_PASS} | base64 -d` \
    -e CYPRESS_GH_PR_TITLE=${PR_TITLE} \
    -e CYPRESS_SSO_URL=${HAC_KC_SSO_URL} \
    -e GH_COMMENTBODY=${GH_COMMENTBODY}"
TEST_IMAGE="quay.io/hacdev/hac-tests:next"

# If test dockerfile changes, rebuild the runner image
if ! git diff --exit-code --quiet origin/$ghprbTargetBranch HEAD -- integration-tests/Dockerfile; then
  echo "Dockerfile changes detected, rebuilding test image"
  TEST_IMAGE="hac-dev:pr-${ghprbPullId}"

  cd integration-tests
  docker build -t "$TEST_IMAGE" . -f Dockerfile
  podman pull docker-daemon:$TEST_IMAGE
  cd ..
fi

set +e
TEST_RUN=0

podman run --userns=keep-id ${COMMON_SETUP} \
    -e CYPRESS_GH_TOKEN=${CYPRESS_GH_TOKEN} \
    -e CYPRESS_GH_PASSWORD=${CYPRESS_GH_PASSWORD} \
    -e CYPRESS_GH_SETUP_KEY=${CYPRESS_GH_SETUP_KEY} \
    -e CYPRESS_QUAY_TOKEN=${CYPRESS_QUAY_TOKEN} \
    -e CYPRESS_RP_TOKEN=${CYPRESS_RP_HAC} \
    -e CYPRESS_VC_KUBECONFIG=${CYPRESS_VC_KUBECONFIG} \
    -e CYPRESS_SNYK_TOKEN=${CYPRESS_SNYK_TOKEN} \
    ${TEST_IMAGE} || TEST_RUN=1

if [[ $TEST_IMAGE =~ "hac-dev:pr" ]]; then
  podman rmi -f $TEST_IMAGE
  docker rmi -f $TEST_IMAGE
fi

bonfire namespace release -f ${NAMESPACE}

# Stubbed out for now
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

# teardown_docker
exit $TEST_RUN
