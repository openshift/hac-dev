#!/bin/bash
for value in $(oc get components -o name)
do
    echo "Deleting $value"
    oc delete $value
done

for value in $(oc get applications -o name)
do
    echo "Deleting $value"
    oc delete $value
done

echo "Done running the script"
