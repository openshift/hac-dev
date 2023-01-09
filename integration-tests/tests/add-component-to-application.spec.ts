import { actions } from '../support/pageObjects/global-po';
import { IntegrationTestsTabPage } from '../support/pages/tabs/IntegrationTestsTabPage';
import { addIntegrationTestStep, Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Components using the UI', () => {
  const LOCAL_STORAGE_KEY_GS_MODAL = 'getting-started-modal';
  const LOCAL_STORAGE_KEY_APPLICATION_MODAL = 'showApplicationModal';
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
  const integrationTestNames = ['my-test-1', 'my-optional-test'];
  const integrationTestMetadata = [
    integrationTestNames[1],
    'quay.io/kpavic/test-bundle:pipeline',
    pipelineName,
    'test.appstudio.openshift.io/optional=true',
    applicationName,
  ];

  before(function () {
    localStorage.setItem(LOCAL_STORAGE_KEY_GS_MODAL, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_APPLICATION_MODAL, 'true');
  });

  beforeEach(function () {
    localStorage.setItem(LOCAL_STORAGE_KEY_GS_MODAL, 'true');
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
      Applications.createComponent(publicRepos[0], componentNames[0]);
      Applications.createdComponentExists(componentNames[0], applicationName);
    });
  });

  describe('Add a new component using the "Overview" tab', () => {
    it("Use 'Components' tabs to start adding a new component", () => {
      Applications.goToOverviewTab().addComponent();
    });

    it('Add a component to Application', () => {
      Applications.createComponent(publicRepos[1], componentNames[1]);
      Applications.createdComponentExists(componentNames[1], applicationName);
    });
  });

  describe('Add a new component using the "Components" tab', () => {
    it("Use HACBS 'Components' tabs to start adding a new component", () => {
      Applications.goToComponentsTab().clickAddComponent();
    });

    it('Add a component to Application', () => {
      Applications.createComponent(publicRepos[1], componentNames[2]);
      Applications.createdComponentExists(componentNames[2], applicationName);
    });
  });

  describe('Add a new component using the "Actions" dropdown', () => {
    it("Click 'Actions' dropdown to add a component", () => {
      Applications.clickActionsDropdown('Add component');
    });

    it('Add a component to Application', () => {
      Applications.createComponent(publicRepos[2], componentNames[3]);
      Applications.createdComponentExists(componentNames[3], applicationName);
    });
  });

  describe('Explore Integration Tests Tab', () => {
    it("Click 'Actions' dropdown to add a integration test", () => {
      Applications.clickActionsDropdown('Add integration test');
      addIntegrationTestStep(integrationTestNames[0]);
    });

    it("Click on 'Integration tests' tab and check the List View", () => {
      Applications.goToIntegrationTestsTab();
      integrationTestsTabPage.checkRowValues(
        integrationTestNames[0],
        containerImage,
        'Mandatory',
        pipelineName,
      );
    });

    it("Add a new Integration Test using 'Actions' dropdown, and mark it as Optional for release", () => {
      Applications.clickActionsDropdown('Add integration test');
      addIntegrationTestStep(integrationTestNames[1], true);

      integrationTestsTabPage.checkRowValues(
        integrationTestNames[1],
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
      // Only the first Integration test with prefix "my-test" should be visible
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
        integrationTestNames[1],
        containerImage,
        'Optional',
        pipelineName,
      );
    });

    it('Explore the Integration Test Details page (with the Optional tag) and delete it', () => {
      cy.contains(integrationTestNames[1]).click();
      integrationTestsTabPage.checkMetadata(integrationTestMetadata);

      Applications.clickActionsDropdown('Delete');
      cy.get(actions.deleteModalButton).click();
      cy.get(integrationTestNames[1]).should('not.exist');
    });

    it('Delete all the remaining Integration Tests from the list view', () => {
      for (let i = 0; i < integrationTestNames.length - 1; i++) {
        integrationTestsTabPage.deleteIntegrationTest(integrationTestNames[i]);
        cy.get(integrationTestNames[i]).should('not.exist');
      }
    });
  });
});
