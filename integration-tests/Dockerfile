ARG NODE_VERSION='16.19.1'
ARG CHROME_VERSION='110.0.5481.177-1'

FROM cypress/factory

ENV OC_DOWNLOAD_URL="https://downloads-openshift-console.apps.hac-devsandbox.5unc.p1.openshiftapps.com/amd64/linux/oc.tar"

RUN apt update && \
    apt install jq python3 python3-venv xauth skopeo -y && \
    curl -L -o /tmp/oc.tar ${OC_DOWNLOAD_URL} && \
    tar -xf /tmp/oc.tar -C /usr/bin

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

COPY . /tmp/e2e

RUN cd /tmp/e2e && \
    npm i && \
    node_modules/.bin/cypress install && \
    mkdir -p /tmp/artifacts && \
    chmod -R a+rwx /tmp/artifacts

WORKDIR /tmp/
COPY --chown=0:0 entrypoint.sh /tmp/

RUN chmod aug+rwx /tmp/entrypoint.sh

ENTRYPOINT ["/tmp/entrypoint.sh"]