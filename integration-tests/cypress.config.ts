import { defineConfig } from 'cypress';
import * as fs from 'fs-extra';
import * as glob from 'glob';
const registerReportPortalPlugin = require('@reportportal/agent-js-cypress/lib/plugin');
const { mergeLaunches } = require('@reportportal/agent-js-cypress/lib/mergeLaunches');
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
function deleteLaunchFiles() {
  const getLaunchTempFiles = () => {
    return glob.sync('rplaunch*.tmp');
  };
  const deleteTempFile = (filename) => {
    fs.unlinkSync(filename);
  };
  const files = getLaunchTempFiles();
  files.forEach(deleteTempFile);
}

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
    reporterEnabled:
      'cypress-mochawesome-reporter, spec, mocha-junit-reporter, @reportportal/agent-js-cypress',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/junit-[hash].xml',
    },
    reportportalAgentJsCypressReporterOptions: {
      endpoint: 'https://reportportal-appstudio-qe.apps.ocp-c1.prod.psi.redhat.com/api/v1',
      token: 'xxx',
      launch: 'hac-dev-pr-check',
      project: 'hac-dev',
      description: 'HAC dev e2e test suite',
      debug: true,
      isLaunchMergeRequired: true,
    },
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
      embeddedScreenshots: true,
      ignoreVideos: true,
    },
  },
  e2e: {
    supportFile: 'support/commands/index.ts',
    specPattern: 'tests/*.spec.ts',
    testIsolation: false,
    excludeSpecPattern:
      process.env.CYPRESS_PERIODIC_RUN || process.env.GH_COMMENTBODY?.toLowerCase() == '[test]'
        ? ''
        : 'tests/advanced-happy-path*',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
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

      // workaround for report portal runs not finishing
      on('after:run', async () => {
        if (config.env.PR_CHECK === true) {
          let retries = 10;
          console.log('Wait for reportportal agent to finish...');
          while (glob.sync('rplaunchinprogress*.tmp').length > 0) {
            if (retries < 1) {
              console.log('reportportal agent timed out after 20s');
              return;
            }
            retries--;
            await new Promise((res) => setTimeout(res, 2000));
          }
          console.log('reportportal agent finished');

          if (
            config.reporterOptions.reportportalAgentJsCypressReporterOptions.isLaunchMergeRequired
          ) {
            try {
              console.log('Merging launches...');
              await mergeLaunches(config.reporterOptions.reportportalAgentJsCypressReporterOptions);
              console.log('Launches successfully merged!');
              deleteLaunchFiles();
            } catch (mergeError: unknown) {
              console.error(mergeError);
            }
          }
        }
        // cypress-mochawesome-reporter
        await afterRunHook();
      });

      const defaultValues: { [key: string]: string | boolean } = {
        HAC_BASE_URL: 'https://prod.foo.redhat.com:1337/beta/hac/application-pipeline',
        USERNAME: '',
        PASSWORD: '',
        GH_USERNAME: 'hac-test',
        KUBECONFIG: '~/.kube/appstudio-config',
        CLEAN_NAMESPACE: 'false',
        PR_CHECK: false,
        PERIODIC_RUN: false,
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
        config.reporterOptions.reportportalAgentJsCypressReporterOptions.token =
          config.env.RP_TOKEN;
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
  },
});
