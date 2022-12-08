import { Applications } from '../../utils/Applications';
import { Common } from '../../utils/Common';
import { addIntegrationTestStep, HACBSApplications } from '../../utils/HACBSApplications';
import { actions } from '../../support/pageObjects/global-po';
import { IntegrationTestsTabPage } from '../../support/pages/hacbs/tabs/IntegrationTestsTabPage';

describe('Create Components using the HACBS UI', () => {
  const LOCAL_STORAGE_KEY_GS_MODAL = 'hacbs/getting-started-modal';
  const LOCAL_STORAGE_KEY_QUICKSTART = 'hacbs/showApplicationQuickstart';
  const LOCAL_STORAGE_KEY_APPLICATION_MODAL = 'hacbs/showApplicationModal';
  const applicationName = Common.generateAppName();
  const integrationTestsTabPage = new IntegrationTestsTabPage();
  const containerImage = 'https://quay.io/kpavic/test-bundle:pipeline';
  const pipelineName = 'demo-pipeline';
  const publicRepos = [
    'https://github.com/dheerajodha/devfile-sample-code-with-quarkus',
    'https://github.com/devfile-samples/devfile-sample-go-basic.git',
    'https://github.com/nodeshift-starters/devfile-sample.git',
  ];
  const componentNames = ['java-quarkus', 'go', 'go-component', 'nodejs'];
  const integrationTestNames = [
    'my-test-1',
    'my-test-2',
    'my-test-3',
    'my-test-4',
    'my-optional-test',
  ];
  const integrationTestMetadata = [
    integrationTestNames[4],
    'quay.io/kpavic/test-bundle:pipeline',
    pipelineName,
    'test.appstudio.openshift.io/optional=true',
    applicationName,
  ];

  before(function () {
    localStorage.setItem(LOCAL_STORAGE_KEY_GS_MODAL, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_APPLICATION_MODAL, 'true');
    // Need to reload the page after enabling HACBS via localStorage
    cy.reload();
  });

  beforeEach(function () {
    localStorage.setItem(LOCAL_STORAGE_KEY_GS_MODAL, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_QUICKSTART, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_APPLICATION_MODAL, 'true');
  });

  after(function () {
    //Delete the application
    Applications.deleteApplication(applicationName);
  });

  describe('Create an Application with a component', () => {
    it('Set Application Name', () => {
      Applications.createApplication(applicationName);
    });

    it('Add a component to Application', () => {
      HACBSApplications.createComponent(publicRepos[0], componentNames[0], integrationTestNames[0]);
      HACBSApplications.createdComponentExists(componentNames[0], applicationName);
    });
  });

  describe('Add a new component using the "Overview" tab', () => {
    it("Use HACBS 'Components' tabs to start adding a new component", () => {
      HACBSApplications.goToOverviewTab().addComponent();
    });

    it('Add a component to Application', () => {
      HACBSApplications.createComponent(publicRepos[1], componentNames[1], integrationTestNames[1]);
      HACBSApplications.createdComponentExists(componentNames[1], applicationName);
    });
  });

  describe('Add a new component using the "Components" tab', () => {
    it("Use HACBS 'Components' tabs to start adding a new component", () => {
      HACBSApplications.goToComponentsTab().clickAddComponent();
    });

    it('Add a component to Application', () => {
      HACBSApplications.createComponent(publicRepos[1], componentNames[2], integrationTestNames[2]);
      HACBSApplications.createdComponentExists(componentNames[2], applicationName);
    });
  });

  describe('Add a new component using the "Actions" dropdown', () => {
    it("Click 'Actions' dropdown to add a component", () => {
      HACBSApplications.clickActionsDropdown('Add component');
    });

    it('Add a component to Application', () => {
      HACBSApplications.createComponent(publicRepos[2], componentNames[3], integrationTestNames[3]);
      HACBSApplications.createdComponentExists(componentNames[3], applicationName);
    });
  });

  describe('Explore Integration Tests Tab', () => {
    it("Click on 'Integration tests' tab and check the List View", () => {
      HACBSApplications.goToIntegrationTestsTab();

      for (let i = 0; i < integrationTestNames.length - 1; i++) {
        integrationTestsTabPage.checkRowValues(
          integrationTestNames[i],
          containerImage,
          'Mandatory',
          pipelineName,
        );
      }
    });

    it("Add a new Integration Test using 'Actions' dropdown, and mark it as Optional for release", () => {
      HACBSApplications.clickActionsDropdown('Add integration test');
      addIntegrationTestStep(integrationTestNames[4], true);

      integrationTestsTabPage.checkRowValues(
        integrationTestNames[4],
        containerImage,
        'Optional',
        pipelineName,
      );
    });

    it("Filter Integration tests by 'Name'", () => {
      // No Integration test should be visible
      integrationTestsTabPage.filterByName('nothing');
      cy.contains('No results found');

      integrationTestsTabPage.filterByName('my-test');
      // Only the first 4 Integration tests with prefix "my-test" should be visible
      for (let i = 0; i < integrationTestNames.length - 1; i++) {
        integrationTestsTabPage.checkRowValues(
          integrationTestNames[i],
          containerImage,
          'Mandatory',
          pipelineName,
        );
      }

      // Only the 1 Integration test should be visible, which is Optional for release
      integrationTestsTabPage.filterByName('optional');
      integrationTestsTabPage.checkRowValues(
        integrationTestNames[4],
        containerImage,
        'Optional',
        pipelineName,
      );
    });

    it('Explore the Integration Test Details page (with the Optional tag) and delete it', () => {
      cy.contains(integrationTestNames[4]).click();
      integrationTestsTabPage.checkMetadata(integrationTestMetadata);

      HACBSApplications.clickActionsDropdown('Delete');
      cy.get(actions.deleteModalButton).click();
      cy.get(integrationTestNames[4]).should('not.exist');
    });

    it('Delete all the remaining Integration Tests from the list view', () => {
      for (let i = 0; i < integrationTestNames.length - 1; i++) {
        integrationTestsTabPage.deleteIntegrationTest(integrationTestNames[i]);
        cy.get(integrationTestNames[i]).should('not.exist');
      }
    });
  });
});
