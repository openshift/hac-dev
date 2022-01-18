module.exports = (on, config) => {
  if (!config.env.hasOwnProperty('HAC_BASE_URL')) {
    config.env.HAC_BASE_URL = 'https://prod.foo.redhat.com:1337/beta/hac/app-studio';
  }
  if (!config.env.hasOwnProperty('USERNAME')) {
    config.env.USERNAME = '';
  }
  if (!config.env.hasOwnProperty('PASSWORD')) {
    config.env.PASSWORD = '';
  }
  if (!config.env.hasOwnProperty('KUBECONFIG')) {
    config.env.KUBECONFIG = '~/.kube/appstudio-config';
  }
  if (!config.env.hasOwnProperty('CLEAN_NAMESPACE')) {
    config.env.CLEAN_NAMESPACE = 'false';
  }
  return config;
};
