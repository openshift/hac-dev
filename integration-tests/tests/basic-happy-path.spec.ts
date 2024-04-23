import { FULL_APPLICATION_TITLE } from '../support/constants/PageTitle';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import {
  ComponentDetailsPage,
  ComponentPageTabs,
  DeploymentsTab,
} from '../support/pages/ComponentDetailsPage';
import { ComponentsTabPage } from '../support/pages/tabs/ComponentsTabPage';
import { IntegrationTestsTabPage } from '../support/pages/tabs/IntegrationTestsTabPage';
import {
  DetailsTab,
  PipelinerunsTabPage,
  TaskRunsTab,
} from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';

describe('Basic Happy Path', () => {
  const applicationName = Common.generateAppName();
  const applicationDetailPage = new ApplicationDetailPage();
  const integrationTestsTab = new IntegrationTestsTabPage();
  const publicRepo = 'https://github.com/hac-test/devfile-sample-code-with-quarkus';
  const componentName: string = Common.generateAppName('java-quarkus');
  const piplinerunlogsTasks = ['init', 'clone-repository', 'build-container', 'show-summary'];
  const quarkusDeplomentBody = 'Congratulations, you have created a new Quarkus cloud application';

  after(function () {
    // If some test failed, don't remove the app
    let allTestsSucceeded = true;
    this.test.parent.eachTest((test) => {
      if (test.state === 'failed') {
        allTestsSucceeded = false;
      }
    });
    if (allTestsSucceeded || Cypress.env('REMOVE_APP_ON_FAIL')) {
      Applications.deleteApplication(applicationName);
    }
  });

  it('Create an Application with a component', () => {
    Applications.createApplication();
    Applications.createComponent(publicRepo, componentName, applicationName);
    Applications.checkComponentInListView(
      componentName,
      applicationName,
      'Build running',
      'Default',
    );
  });

  it('Check default Integration Test', () => {
    Applications.goToIntegrationTestsTab();
    integrationTestsTab.hasIntegrationTest(`${applicationName}-enterprise-contract`);
  });

  describe('Check different ways to add a component', () => {
    afterEach(() => {
      Applications.clickBreadcrumbLink(applicationName);
      cy.url().should('include', `${applicationName}`);
    });

    it("Use 'Components' tabs to start adding a new component", () => {
      Applications.goToOverviewTab().addComponent();
      cy.title().should('eq', `Import - Add components | ${FULL_APPLICATION_TITLE}`);
      cy.url().should('include', `/import?application=${applicationName}`);
    });

    it("Use HACBS 'Components' tabs to start adding a new component", () => {
      Applications.goToComponentsTab();
      ComponentsTabPage.clickAddComponent();
      cy.title().should('eq', `Import - Add components | ${FULL_APPLICATION_TITLE}`);
      cy.url().should('include', `/import?application=${applicationName}`);
    });

    it("Click 'Actions' dropdown to add a component", () => {
      Applications.clickActionsDropdown('Add component');
      cy.title().should('eq', `Import - Add components | ${FULL_APPLICATION_TITLE}`);
      cy.url().should('include', `/import?application=${applicationName}`);
    });
  });

  describe('Explore Pipeline runs Tab', () => {
    after(() => {
      Applications.clickBreadcrumbLink(applicationName);
    });

    it('Verify the Pipeline run details and Node Graph view', () => {
      Applications.goToPipelinerunsTab();
      UIhelper.getTableRow('Pipeline run List', 'Running')
        .contains(`${componentName}-`)
        .invoke('text')
        .then((pipelinerunName) => {
          PipelinerunsTabPage.clickOnRunningPipelinerun(componentName);
          UIhelper.verifyLabelAndValue('Namespace', Cypress.env('HAC_NAMESPACE'));
          UIhelper.verifyLabelAndValue('Pipeline', pipelinerunName);
          UIhelper.verifyLabelAndValue('Application', applicationName);
          UIhelper.verifyLabelAndValue('Component', componentName);
          UIhelper.verifyLabelAndValue('Related pipelines', '0 pipelines');

          DetailsTab.waitForPLRAndDownloadAllLogs();

          //Verify the Pipeline run details Graph
          piplinerunlogsTasks.forEach((item) => {
            UIhelper.verifyGraphNodes(item);
          });

          TaskRunsTab.goToTaskrunsTab();
          TaskRunsTab.assertTaskNamesAndTaskRunStatus(
            TaskRunsTab.getbasicTaskNamesList(pipelinerunName),
          );
        });
    });

    it('Verify Enterprise contract Test pipeline run Details', () => {
      Applications.clickBreadcrumbLink('Pipeline runs');
      UIhelper.clickRowCellInTable('Pipeline run List', 'Test', `${applicationName}-`);
      DetailsTab.waitForPLRAndDownloadAllLogs(false);
    });
  });

  describe('Check Component in Components tab', () => {
    before(() => {
      Applications.goToComponentsTab();
    });

    it('Check component build status', () => {
      Applications.checkComponentStatus(componentName, 'Build completed');
    });

    it('Validate Build Logs are successful', () => {
      applicationDetailPage.openBuildLog(componentName);
      applicationDetailPage.verifyBuildLogTaskslist(piplinerunlogsTasks); //TO DO : Fetch the piplinerunlogsTasks from cluster using api At runtime.
      applicationDetailPage.verifyFailedLogTasksNotExists();
      applicationDetailPage.checkBuildLog('show-summary', 'Image is in : quay.io');
      applicationDetailPage.closeBuildLog();
    });
  });

  describe('Check Component Details', () => {
    before(() => {
      ComponentsTabPage.openComponent(componentName);
    });

    it('Verify deployed image exists', () => {
      ComponentDetailsPage.checkBuildImage();
    });
  });

  describe('Check Application Overview', () => {
    before(() => {
      Common.openApplicationURL(applicationName);
    });

    it('Validate the graph views for the created application', () => {
      UIhelper.verifyGraphNodes('Components', false);
      UIhelper.verifyGraphNodes('Builds');
    });
  });
});
