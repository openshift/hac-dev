#!/usr/bin/env bash
set -e
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

source $SCRIPT_DIR/../../.env

COSIGN_SECRET_NAME="cosign-public-key"
DEV_WORKSPACE=${DEV_NAMESPACE:-"hacbs"}
MANAGED_WORKSPACE=${MANAGED_NAMESPACE:-"managed-hacbs"}
QUAY_ROBOT_ACCOUNT=${QUAY_USERNAME}
QUAY_PASSWORD=${QUAY_PASSWORD}
QUAY_SECRET_NAME="hacbs-release-tests-token"

tempDir=$(mktemp -d /tmp/m7.XXX)
trap 'rm -rf "$tempDir"' EXIT

create_resources() {
  oc kustomize "$SCRIPT_DIR/dev-workspace"  | sed 's|<dev-namespace>| '${DEV_WORKSPACE}'|' | sed 's|<managed-namespace>|'${MANAGED_WORKSPACE}'|' | oc apply -f -

  # appstudio-staging users dont have enough permissions for managed namespace, disabling this for now
  # oc kustomize "$SCRIPT_DIR/managed-workspace" | sed 's|<managed-namespace>|'${MANAGED_WORKSPACE}'|' | sed 's|<dev-namespace>|'${DEV_WORKSPACE}'|'
}

create_quay_secret() {
  podman login --username "$QUAY_ROBOT_ACCOUNT" --password "$QUAY_PASSWORD"  quay.io
  kubectl create secret generic "$QUAY_SECRET_NAME" -n "$MANAGED_WORKSPACE" \
      --from-file=.dockerconfigjson="$AUTH_FILE" --type=kubernetes.io/dockerconfigjson
}

create_cosign_secret() {
  cosign public-key --key k8s://tekton-chains/signing-secrets > "$tempDir/cosign.pub"
  kubectl create secret generic $COSIGN_SECRET_NAME -n "$MANAGED_WORKSPACE" --from-file="$tempDir/cosign.pub"
}



create_resources

# appstudio-staging users dont have enough permissions for managed namespace, disabling this for now
# create_quay_secret
# create_cosign_secret 
