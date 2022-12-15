import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import {
  overviewTabPO,
  componentsTabPO,
  integrationTestsTabPO,
  actionsDropdown,
} from '../support/pageObjects/hacbs-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { AddIntegrationTestPage } from '../support/pages/hacbs/AddIntegrationTestPage';
import { ComponentsTabPage } from '../support/pages/hacbs/tabs/ComponentsTabPage';
import { CreateBuildPage } from '../support/pages/hacbs/CreateBuildPage';
import { Applications } from './Applications';
import { Common } from './Common';
import { OverviewTabPage } from '../support/pages/hacbs/tabs/OverviewTabPage';

export class HACBSApplications {
  static deleteApplication(applicationName: string) {
    Applications.deleteApplication(applicationName);
  }

  static createApplication(name: string) {
    Applications.createApplication(name);
  }

  static createComponent(publicGitRepo: string, componentName: string) {
    addComponentStep(publicGitRepo);
    reviewComponentsStep(componentName);
  }

  static createIntegrationTest(integrationTestName: string, optionalForRelease: boolean = false) {
    addIntegrationTestStep(integrationTestName, optionalForRelease);
  }

  static createdComponentExists(componentName: string, applicationName: string) {
    this.goToComponentsTab();

    Common.verifyPageTitle(applicationName);
    Common.waitForLoad();
    this.getComponentListItem(componentName).should('exist');
  }

  static getComponentListItem(application: string) {
    return cy.contains(applicationDetailPagePO.item, application, { timeout: 60000 });
  }

  static clickActionsDropdown(dropdownItem: string) {
    cy.get(actionsDropdown.dropdown).click();
    cy.contains(dropdownItem).click();
  }

  static goToOverviewTab() {
    cy.get(overviewTabPO.clickTab).click();
    return new OverviewTabPage();
  }

  static goToComponentsTab() {
    cy.get(componentsTabPO.clickTab).click();
    return new ComponentsTabPage();
  }

  static goToIntegrationTestsTab() {
    cy.get(integrationTestsTabPO.clickTab).click();
  }
}

function addComponentStep(publicGitRepo: string) {
  const addComponent = new AddComponentPage();

  // Enter git repo URL
  addComponent.setSource(publicGitRepo);
  // Check if the source is validated
  addComponent.waitRepoValidated();
  // Setup Git Options
  addComponent.clickGitOptions();

  addComponent.clickNext();
}

function reviewComponentsStep(componentName: string) {
  const componentPage = new ComponentPage();

  // Edit component name
  componentPage.editComponentName(componentName + '-temp');
  cy.contains('div', componentName + '-temp').should('be.visible');

  // Switch back to orginal name
  componentPage.editComponentName(componentName);
  cy.contains('div', componentName).should('be.visible');

  //Create Application
  componentPage.createApplication();
}

function createBuildStep() {
  new CreateBuildPage().clickNext();
}

export function addIntegrationTestStep(displayName: string, optionalForRelease: boolean = false) {
  const addIntegrationTestPage = new AddIntegrationTestPage();
  const containerImage = 'quay.io/kpavic/test-bundle:pipeline';
  const pipelineName = 'demo-pipeline';

  addIntegrationTestPage.enterDisplayName(displayName);
  addIntegrationTestPage.enterContainerImage(containerImage);
  addIntegrationTestPage.enterPipelineName(pipelineName);

  if (optionalForRelease) {
    addIntegrationTestPage.markOptionalForRelease();
  }

  cy.get('body').then((body) => {
    body.find('button[type="submit"]').length > 0
      ? addIntegrationTestPage.clickNext()
      : addIntegrationTestPage.clickAdd();
  });
}
