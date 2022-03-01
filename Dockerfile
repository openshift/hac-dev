FROM registry.access.redhat.com/ubi8/nginx-118
COPY ./nginx.conf /opt/app-root/etc/nginx/conf.d/default.conf
COPY . /opt/app-root/src
ADD ./nginx.conf "${NGINX_CONFIGURATION_PATH}"
CMD ["nginx", "-g", "daemon off;"]
