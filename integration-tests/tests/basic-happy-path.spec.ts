import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import {
  DetailsTab,
  LogsTab,
  PipelinerunsTabPage,
  TaskRunsTab,
} from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';
import { APIHelper } from '../utils/APIHelper';
import { FULL_APPLICATION_TITLE } from '../support/constants/PageTitle';
import { IntegrationTestsTabPage } from '../support/pages/tabs/IntegrationTestsTabPage';
import { githubAPIEndpoints } from '../utils/APIEndpoints';

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
      if (test.state == 'failed') {
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
      'Build Running',
      'Default',
    );
  });

  it('Check default Integration Test', () => {
    Applications.goToIntegrationTestsTab();
    integrationTestsTab.hasIntegrationTest(`${applicationName}-enterprise-contract`);
  });

  describe('Check different ways to add a component', () => {
    it("Use 'Components' tabs to start adding a new component", () => {
      Applications.goToOverviewTab().addComponent();
      cy.title().should('eq', `Import - Add components | ${FULL_APPLICATION_TITLE}`);
      cy.url().should('include', `/import?application=${applicationName}`);

      Applications.clickBreadcrumbLink(applicationName);
      cy.url().should('include', `${applicationName}`);
    });

    it("Use HACBS 'Components' tabs to start adding a new component", () => {
      Applications.goToComponentsTab().clickAddComponent();
      cy.title().should('eq', `Import - Add components | ${FULL_APPLICATION_TITLE}`);
      cy.url().should('include', `/import?application=${applicationName}`);

      Applications.clickBreadcrumbLink(applicationName);
      cy.url().should('include', `${applicationName}`);
    });

    it("Click 'Actions' dropdown to add a component", () => {
      Applications.clickActionsDropdown('Add component');
      cy.title().should('eq', `Import - Add components | ${FULL_APPLICATION_TITLE}`);
      cy.url().should('include', `/import?application=${applicationName}`);

      Applications.clickBreadcrumbLink(applicationName);
      cy.url().should('include', `${applicationName}`);
    });
  });

  describe('Explore Pipeline runs Tab', () => {
    it('Verify the Pipeline run details and Node Graph view', () => {
      Applications.goToPipelinerunsTab();
      UIhelper.getTableRow('Pipeline run List', 'Running')
        .contains(`${componentName}-`)
        .invoke('text')
        .then((pipelinerunName) => {
          PipelinerunsTabPage.clickOnRunningPipelinerun(componentName);
          UIhelper.verifyLabelAndValue('Namespace', Cypress.env('HAC_NAMESPACE'));
          UIhelper.verifyLabelAndValue('Pipeline', 'docker-build');
          UIhelper.verifyLabelAndValue('Application', applicationName);
          UIhelper.verifyLabelAndValue('Component', componentName);
          UIhelper.verifyLabelAndValue('Related pipelines', '0 pipelines');
          DetailsTab.waitUntilStatusIsNotRunning();

          LogsTab.downloadAllTaskLogs();
          UIhelper.verifyLabelAndValue('Status', 'Succeeded');

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
  });

  describe('Check Component Deployment, Build logs and Application Status', () => {
    it('Verify the status code and response body of the deployment URL of each component', () => {
      Applications.clickBreadcrumbLink('Pipeline runs');
      Applications.goToComponentsTab();

      applicationDetailPage.expandDetails(componentName);

      cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 })
        .invoke('text')
        .then((route) => {
          APIHelper.checkResponseBodyAndStatusCode(route, quarkusDeplomentBody, 10000);
        });

      Applications.checkComponentStatus(componentName, 'Build Succeeded');
    });

    it('Verify deployed image exists', () => {
      cy.get('.component-list-item__details input')
        .invoke('val')
        .then((value) => {
          cy.exec(`skopeo inspect -f "Name: {{.Name}} Digest: {{.Digest}}" docker://${value}`, {
            timeout: 300000,
          })
            .its('code')
            .should('eq', 0);
        });
    });

    it('Validate Build Logs are successful', () => {
      applicationDetailPage.openBuildLog(componentName);
      applicationDetailPage.verifyBuildLogTaskslist(piplinerunlogsTasks); //TO DO : Fetch the piplinerunlogsTasks from cluster using api At runtime.
      applicationDetailPage.verifyFailedLogTasksNotExists();
      applicationDetailPage.checkBuildLog('show-summary', 'Image is in : quay.io');
      applicationDetailPage.closeBuildLog();
    });

    it('Validate Application Status', () => {
      Applications.goToOverviewTab();
      Applications.verifyAppstatusIsSucceeded();
    });

    it('Verify manual build commit in Latest Commit on Overview Tab', () => {
      APIHelper.githubRequest(
        'GET',
        githubAPIEndpoints.commits(publicRepo.split('/')[3], publicRepo.split('/')[4]),
      )
        .its('body[0].sha')
        .then((commitSHA) => {
          UIhelper.verifyRowInTable('Commit List', componentName, [
            /main/,
            new RegExp(`manual build ${commitSHA.slice(0, 6)}`),
            /^-$/,
            /Succeeded/,
          ]);
        });
    });

    it('Validate the graph views for the created application', () => {
      UIhelper.verifyGraphNodes('Components', false);
      UIhelper.verifyGraphNodes('Builds');
      UIhelper.verifyGraphNodes('Static environments');
    });
  });
});
