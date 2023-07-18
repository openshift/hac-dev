#!/bin/bash
set -e

REPO_ROOT=$(git rev-parse --show-toplevel)
SCRIPTDIR="$REPO_ROOT/helpers"

#Load environment variables
source $SCRIPTDIR/.env


if [ -z "$QUAY_USERNAME" ]; then
  echo "Missing QUAY_USERNAME variable"
  exit 1
fi


AUTH_FILE="${XDG_RUNTIME_DIR}/containers/auth.json"
if [ ! -f $AUTH_FILE ]; then
  AUTH_FILE=~/.docker/config.json
fi

if ! grep -q quay.io $AUTH_FILE; then
 
  echo "Logging into quay.io"
  podman login --username "$QUAY_USERNAME" --password "$QUAY_PASSWORD"  quay.io

fi

echo 'Setting up'

SECRET=$(mktemp)
echo '{"auths": {' $(yq eval '.auths | with_entries(select(.key == "quay.io"))' $AUTH_FILE) '}}' > $SECRET
# oc create secret docker-registry redhat-appstudio-registry-pull-secret --from-file=.dockerconfigjson=$SECRET  -o yaml | oc apply -f-
rm $SECRET

oc delete --ignore-not-found -f $SCRIPTDIR/resources/application.yaml
oc create -f $SCRIPTDIR/resources/application.yaml
if ! oc wait --for=condition=Created application/test-application; then
  echo "Application was not created sucessfully, check:"
  echo "oc get applications test-application -o yaml"
  exit 1
fi

show_spinner()
{
  local -r pid="${1}"
  local -r delay='0.75'
  local spinstr='\|/|-'
  local temp
  while ps a | awk '{print $1}' | grep -q "${pid}"; do
    temp="${spinstr#?}"
    printf " [%c]  " "${spinstr}"
    spinstr=${temp}${spinstr%"${temp}"}
    sleep "${delay}"
    printf "\b\b\b\b\b\b"
  done
  printf "    \b\b\b\b"
}

create_component() {
  echo -e "Creating component using $1"
  GIT_URL=$1
  NAME=$(echo $GIT_URL | grep -o '[^/]*$')
  IMAGE=quay.io/$QUAY_USERNAME/$NAME
  oc delete --ignore-not-found component $NAME
  yq e "(.metadata.name=\"$NAME\") | (.spec.componentName=\"$NAME\") | (.spec.source.git.url=\"$GIT_URL\") | (.spec.containerImage=\"$IMAGE\") | (.metadata.annotations.\"build.appstudio.openshift.io/request\"=\"${PIPELINESASCODE:-"configure-pac"}\")" $SCRIPTDIR/resources/component.yaml | oc apply -f-
}

create_component_test() {
  echo -e 'Creating component test'
  oc apply -f  $SCRIPTDIR/resources/componentTest.yaml 
}

create_application_test() {
  echo -e 'Creating application test'
    oc apply -f  $SCRIPTDIR/resources/applicationTest.yaml 
}

create_environment() {
  echo -e 'Creating environments'
  oc apply -f  $SCRIPTDIR/resources/environment.yaml 
}

 create_component $1 & show_spinner $!
 create_component_test & show_spinner $!
 create_application_test & show_spinner $!
 create_environment & show_spinner $!


sh $SCRIPTDIR/resources/release/bootstrap.sh


echo -e Git Repo created:
oc get application/test-application -o jsonpath='{.status.devfile}' | grep appModelRepository.url | cut -f2- -d':'

echo " "
echo -e "Merge your PR to trigger the build pipeline: \033[36m $1/pulls \033[0m"

