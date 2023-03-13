import { defineConfig } from "cypress";
import * as fs from 'fs-extra';
const registerReportPortalPlugin = require('@reportportal/agent-js-cypress/lib/plugin');

export default defineConfig({
  defaultCommandTimeout: 40000,
  execTimeout: 150000,
  pageLoadTimeout: 90000,
  requestTimeout: 15000,
  responseTimeout: 15000,
  animationDistanceThreshold: 20,
  chromeWebSecurity: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, mocha-junit-reporter, @reportportal/agent-js-cypress',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/junit-[hash].xml'
    },
    reportportalAgentJsCypressReporterOptions: {
      endpoint: 'https://reportportal-appstudio-qe.apps.ocp-c1.prod.psi.redhat.com/api/v1',
      token: 'xxx',
      launch: 'hac-dev-pr-check',
      project: 'hac-dev',
      description: 'HAC dev e2e test suite',
      debug: true,
      autoMerge: true
    }
  },
  e2e: {
    supportFile: 'support/commands/index.ts',
    specPattern: 'tests/*.spec.ts',
    testIsolation: false,
    excludeSpecPattern: 'tests/advanced-happy-path*',
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config);

      const logOptions = {
        outputRoot: `${config.projectRoot}/cypress`,
        outputTarget: {
          'cypress-log.txt': 'txt',
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
          return null;
        },
        deleteFile(filename: string) {
          if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
          }
          return null;
        },
      });

      const defaultValues: { [key: string]: string } = {
        HAC_BASE_URL: 'https://prod.foo.redhat.com:1337/beta/hac/stonesoup',
        USERNAME: '',
        PASSWORD: '',
        KUBECONFIG: '~/.kube/appstudio-config',
        CLEAN_NAMESPACE: 'false',
        PR_CHECK: 'false',
      };

      for (const key in defaultValues) {
        if (!config.env[key]) {
          config.env[key] = defaultValues[key];
        }
      }

      if (
        config.env.PR_CHECK === true &&
        config.reporterOptions.reportportalAgentJsCypressReporterOptions
      ) {
        config.reporterOptions.reportportalAgentJsCypressReporterOptions.token = config.env.RP_TOKEN;
        config.reporterOptions.reportportalAgentJsCypressReporterOptions.description = `${config.env.GH_PR_TITLE}\n${config.env.GH_PR_LINK}`;
        registerReportPortalPlugin(on, config);
      } else {
        const reporters = (config.reporterOptions.reporterEnabled as string)
          .split(',')
          .filter((value) => {
            return !value.includes('@reportportal/agent-js-cypress');
          });
        config.reporterOptions.reporterEnabled = reporters.join(',');
      }
      return config;
    },
  }
});