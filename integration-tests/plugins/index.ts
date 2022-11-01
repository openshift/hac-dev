import * as path from 'path';
import * as fs from 'fs-extra';

function getConfigurationByFile(file: string) {
  const pathToConfigFile = path.resolve('config', `${file}.json`)

  return fs.readJsonSync(pathToConfigFile)
}

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
    },
    readFileIfExists(filename: string) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8');
      }
      return null
    },
    deleteFile(filename: string) {
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
      }
      return null;
    }
  });

  const file = config.env.configFile || 'default';
  const newConfig = getConfigurationByFile(file);
  newConfig.env = config.env;

  const defaultValues: { [key: string]: string } = {
    HAC_BASE_URL: 'https://prod.foo.redhat.com:1337/beta/hac/app-studio',
    USERNAME: '',
    PASSWORD: '',
    KUBECONFIG: '~/.kube/appstudio-config',
    CLEAN_NAMESPACE: 'false',
    PR_CHECK: 'false'
  }

  for (const key in defaultValues) {
    if (!config.env[key]) {
      config.env[key] = defaultValues[key];
    }
  }
  return newConfig;
};
