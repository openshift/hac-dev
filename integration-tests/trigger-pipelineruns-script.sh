#!/bin/bash

currentNamespace=$(oc project | cut -d '"' -f2)

sed -i "s/namespace:.*/namespace: $currentNamespace/g" trigger-pipelinerun-on-pull-request.yaml
sed -i "s/namespace:.*/namespace: $currentNamespace/g" trigger-pipelinerun-on-push.yaml

sed -i "s/value: quay.io\/redhat-appstudio\/user-workload:automated-test-on-pr.*/value: quay.io\/redhat-appstudio\/user-workload:automated-test-on-pr-$1/g" trigger-pipelinerun-on-pull-request.yaml
sed -i "s/value: quay.io\/redhat-appstudio\/user-workload:automated-test-on-push.*/value: quay.io\/redhat-appstudio\/user-workload:automated-test-on-push-$1/g" trigger-pipelinerun-on-push.yaml

oc apply -f trigger-pipelinerun-on-pull-request.yaml
oc apply -f trigger-pipelinerun-on-push.yaml

echo "Done running the script"
