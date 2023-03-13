import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { DetailsTab, PipelinerunsTabPage } from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';

describe('Basic Happy Path', { tags: ['@PR-check', '@publicRepo'] }, () => {
  const applicationName = Common.generateAppName();
  const applicationDetailPage = new ApplicationDetailPage();
  const addComponent = new AddComponentPage();
  const publicRepo = 'https://github.com/hac-test/devfile-sample-code-with-quarkus';
  const componentName: string = Common.generateAppName('java-quarkus');
  const piplinerunlogsTasks = ['init', 'clone-repository', 'build-container', 'show-summary'];
  const quarkusDeplomentBody = 'Congratulations, you have created a new Quarkus cloud application';

  after(function () {
    Applications.deleteApplication(applicationName);
  });

  describe('Create an Application with a component', () => {
    it('Create an Application with a component', () => {
      Applications.createApplication(applicationName);
      Applications.createComponent(publicRepo, componentName);
      Applications.checkComponentInListView(
        componentName,
        applicationName,
        'Build Running',
        'Default build',
      );
    });
  });

  describe('Try to add a new component using the "Overview" tab', () => {
    it("Use 'Components' tabs to start adding a new component", () => {
      Applications.goToOverviewTab().addComponent();
      cy.title().should('eq', 'Import - Add components | CI/CD');
    });

    it('Verify we are on "Add Component" wizard, and then hit Cancel', () => {
      cy.url().should('include', `/import?application=${applicationName}`);
      addComponent.clickCancel();
      cy.url().should('include', `${applicationName}/overview`);
    });
  });

  describe('Try to add a new component using the "Components" tab', () => {
    it("Use HACBS 'Components' tabs to start adding a new component", () => {
      Applications.goToComponentsTab().clickAddComponent();
      cy.title().should('eq', 'Import - Add components | CI/CD');
    });

    it('Verify we are on "Add Component" wizard, and then hit Cancel', () => {
      cy.url().should('include', `/import?application=${applicationName}`);
      addComponent.clickCancel();
      cy.url().should('include', `${applicationName}/components`);
    });
  });

  describe('Try to add a new component using the "Actions" dropdown', () => {
    it("Click 'Actions' dropdown to add a component", () => {
      Applications.clickActionsDropdown('Add component');
      cy.title().should('eq', 'Import - Add components | CI/CD');
    });

    it('Verify we are on "Add Component" wizard, and then hit Cancel', () => {
      cy.url().should('include', `/import?application=${applicationName}`);
      addComponent.clickCancel();
      cy.url().should('include', `${applicationName}/components`);
    });
  });

  describe('Explore Pipeline runs Tab', () => {
    it('Verify the Pipeline run details and Node Graph view', () => {
      Applications.goToPipelinerunsTab();
      PipelinerunsTabPage.clickOnPipelinerun(componentName);

      UIhelper.verifyLabelAndValue('Namespace', `${Cypress.env('USERNAME').toLowerCase()}-tenant`);
      UIhelper.verifyLabelAndValue('Pipeline', 'docker-build');
      UIhelper.verifyLabelAndValue('Application', applicationName);
      UIhelper.verifyLabelAndValue('Component', componentName);
      UIhelper.verifyLabelAndValue('Related pipelines', '0 pipelines');

      DetailsTab.waitUntilStatusIsNotRunning();

      //Verify the Pipeline run details Graph
      piplinerunlogsTasks.forEach((item) => {
        applicationDetailPage.verifyGraphNodes(item);
      });

      DetailsTab.checkStatusSucceeded();
    });
  });

  describe('Check Component Deployment and Build logs', () => {
    it('Verify the status code and response body of the deployment URL of each component', () => {
      Applications.clickBreadcrumbLink('Pipeline runs');
      Applications.goToComponentsTab();

      applicationDetailPage.expandDetails(componentName);

      cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 })
        .invoke('text')
        .then((route) => {
          Common.checkResponseBodyAndStatusCode(route, quarkusDeplomentBody, 10000);
        });

      Applications.checkComponentStatus(componentName, 'Build Succeeded');
    });

    it('Verify deployed image exists', () => {
      cy.get('.component-list-item__details input')
        .invoke('val')
        .then((value) => {
          cy.exec(`skopeo inspect -f "Name: {{.Name}} Digest: {{.Digest}}" docker://${value}`, { timeout: 300000 })
            .its('code').should('eq', 0);
        });
    });

    it('Validate Build Logs are successful', () => {
      applicationDetailPage.openBuildLog(componentName);
      applicationDetailPage.verifyBuildLogTaskslist(piplinerunlogsTasks); //TO DO : Fetch the piplinerunlogsTasks from cluster using api At runtime.
      applicationDetailPage.verifyFailedLogTasksNotExists();
      applicationDetailPage.checkBuildLog('show-summary', 'Image is in : quay.io');
      applicationDetailPage.closeBuildLog();
    });

    it('Validate the graph views for the created application', () => {
      Applications.goToOverviewTab();
      applicationDetailPage.verifyGraphNodes('Components');
      applicationDetailPage.verifyGraphNodes('Builds');
      applicationDetailPage.verifyGraphNodes('Static environments');
    });
  });
});
