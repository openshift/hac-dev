import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { PipelinerunsTabPage } from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Components using the UI', { tags: ['@PR-check', '@publicRepo'] }, () => {
  const applicationName = Common.generateAppName();
  const applicationDetailPage = new ApplicationDetailPage();
  const pipelinerunsTab = new PipelinerunsTabPage();
  const addComponent = new AddComponentPage();
  const publicRepos = [
    'https://github.com/hac-test/devfile-sample-code-with-quarkus',
  ];
  const componentNames: string[] = ['java-quarkus'];
  const deploymentBody = new Map<string, string>();
  const quarkusDeplomentBody = 'Congratulations, you have created a new Quarkus cloud application';

  after(function () {
    Applications.deleteApplication(applicationName);
  });

  describe('Create an Application with a component', () => {
    it('Set Application Name', () => {
      Applications.createApplication(applicationName);
    });

    it('Add a component to Application', () => {
      componentNames[0] = Common.generateAppName(componentNames[0]);
      deploymentBody.set(componentNames[0], quarkusDeplomentBody);

      Applications.createComponent(publicRepos[0], componentNames[0]);
      Applications.checkComponentInListView(componentNames[0], applicationName, 'Build Running', 'Default build');
    });
  });

  describe('Try to add a new component using the "Overview" tab', () => {
    it("Use 'Components' tabs to start adding a new component", () => {
      Applications.goToOverviewTab().addComponent();
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
    });

    it('Verify we are on "Add Component" wizard, and then hit Cancel', () => {
      cy.url().should('include', `/import?application=${applicationName}`);
      addComponent.clickCancel();
      cy.url().should('include', `${applicationName}/components`)
    });
  });

  describe('Explore Pipeline runs Tab', () => {
    it("Verify the PipelineRuns List view", () => {
      Applications.goToPipelinerunsTab();

      cy.get('tbody', { timeout: 60000 }).find("tr").then((row) => {
        for (let i = 0; i < row.length; i++) {
          cy.get('tbody tr', { timeout: 40000 }).eq(i).then(($row) => {
            cy.wrap($row).find('td').eq(0).find('a').then((pipelinerunName) => {
              Applications.createdPipelinerunSucceeded(pipelinerunName.text().trim());
              pipelinerunsTab.pipelineRunList.push(pipelinerunName.text().trim());
            });
          });
        }
      });
    });
  });

  describe('Check Component Deployment', () => {
    it("Verify the status code and response body of the deployment URL of each component", () => {
      Applications.goToComponentsTab();

      for (let componentName of componentNames) {
        applicationDetailPage.expandDetails(componentName);

        cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 }).invoke('text').then(route => {
          Common.checkResponseBodyAndStatusCode(route, deploymentBody.get(componentName), 10000);
        });
      }

      Applications.checkComponentStatus(componentNames[0], 'Build Succeeded');
    })
  });
});
