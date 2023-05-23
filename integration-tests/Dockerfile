FROM quay.io/hacdev/hac-tests:base

ENV OC_DOWNLOAD_URL="https://downloads-openshift-console.apps.hac-devsandbox.5unc.p1.openshiftapps.com/amd64/linux/oc.tar" \
    CYPRESS_CACHE_FOLDER="/tmp/.cache"

RUN curl -L -o /tmp/oc.tar ${OC_DOWNLOAD_URL} && \
    tar -xf /tmp/oc.tar -C /usr/bin

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

RUN wget "https://github.com/sigstore/cosign/releases/download/v2.0.0/cosign-linux-amd64" && \
    mv cosign-linux-amd64 /usr/local/bin/cosign && \
    chmod +x /usr/local/bin/cosign
    
USER node:0

COPY --chown=node:root --chmod=775 . /tmp/e2e
RUN chmod -R 775 /tmp/e2e

RUN cd /tmp/e2e && \
    umask 0002 && \
    npm i && \
    node_modules/.bin/cypress install && \
    mkdir -p /tmp/artifacts && \
    chmod -R a+rwx /tmp/artifacts ${CYPRESS_CACHE_FOLDER}

WORKDIR /tmp/
COPY --chown=node:root --chmod=775 entrypoint.sh /tmp/

ENTRYPOINT ["/tmp/entrypoint.sh"]