module.exports = (on, config) => {
  const logOptions = {
    outputRoot: `${config.projectRoot}/cypress`,
    outputTarget: {
      'cypress-logs.txt': 'txt',
    },
    printLogsToFile: 'always',
  };
  require('cypress-terminal-report/src/installLogsPrinter')(on, logOptions);

  on('task', {
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message);
      return null;
    },
    logTable(data) {
      // eslint-disable-next-line no-console
      console.table(data);
      return null;
    }
  });

  if (!Object.prototype.hasOwnProperty.call(config.env, 'HAC_BASE_URL')) {
    config.env.HAC_BASE_URL = 'https://prod.foo.redhat.com:1337/beta/hac/app-studio';
  }
  if (!Object.prototype.hasOwnProperty.call(config.env, 'USERNAME')) {
    config.env.USERNAME = '';
  }
  if (!Object.prototype.hasOwnProperty.call(config.env, 'PASSWORD')) {
    config.env.PASSWORD = '';
  }
  if (!Object.prototype.hasOwnProperty.call(config.env, 'KUBECONFIG')) {
    config.env.KUBECONFIG = '~/.kube/appstudio-config';
  }
  if (!Object.prototype.hasOwnProperty.call(config.env, 'CLEAN_NAMESPACE')) {
    config.env.CLEAN_NAMESPACE = 'false';
  }
  if (!Object.prototype.hasOwnProperty.call(config.env, 'PR_CHECK')) {
    config.env.PR_CHECK = 'false';
  }
  return config;
};
