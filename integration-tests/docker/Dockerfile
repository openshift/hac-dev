FROM quay.io/redhatqe/cypress:9.6.0

USER root:root

ENV OC_DOWNLOAD_URL="https://downloads-openshift-console.apps.hac-devsandbox.5unc.p1.openshiftapps.com/amd64/linux/oc.tar"

RUN microdnf install --assumeyes which && \
    curl -L -o /tmp/oc.tar ${OC_DOWNLOAD_URL} && \
    tar -xf /tmp/oc.tar -C /usr/bin
    