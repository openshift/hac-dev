import * as path from 'path';
import * as fs from 'fs-extra';
import * as merge from 'deepmerge';
const registerReportPortalPlugin = require('@reportportal/agent-js-cypress/lib/plugin');

function getConfigurationByFile(file: string) {
  const pathToConfigFile = path.resolve('config', `${file}.json`)

  return fs.readJsonSync(pathToConfigFile)
}

module.exports = (on, config) => {
  // optional: register cypress-grep plugin code
  // https://github.com/cypress-io/cypress-grep/tree/v2.14.0
  require('cypress-grep/src/plugin')(config)

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

  const file = config.env.configFile || 'hac-dev-default';
  const configFile = getConfigurationByFile(file);
  const newConfig: any = merge(config, configFile);

  const defaultValues: { [key: string]: string } = {
    HAC_BASE_URL: 'https://prod.foo.redhat.com:1337/beta/hac/stonesoup',
    USERNAME: '',
    PASSWORD: '',
    KUBECONFIG: '~/.kube/appstudio-config',
    CLEAN_NAMESPACE: 'false',
    PR_CHECK: 'false'
  }

  for (const key in defaultValues) {
    if (!newConfig.env[key]) {
      newConfig.env[key] = defaultValues[key];
    }
  }

  if (newConfig.env.PR_CHECK === true && newConfig.reporterOptions.reportportalAgentJsCypressReporterOptions) {
    newConfig.reporterOptions.reportportalAgentJsCypressReporterOptions.token = config.env.RP_TOKEN;
    newConfig.reporterOptions.reportportalAgentJsCypressReporterOptions.description = `${config.env.GH_PR_TITLE}\n${config.env.GH_PR_LINK}`;
    registerReportPortalPlugin(on, newConfig);
  } else {
    const reporters = (newConfig.reporterOptions.reporterEnabled as string).split(',').filter((value) => {
      return !value.includes('@reportportal/agent-js-cypress');
    });
    newConfig.reporterOptions.reporterEnabled = reporters.join(',');
  }
  return newConfig;
};
