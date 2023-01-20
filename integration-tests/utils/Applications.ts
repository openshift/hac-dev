import { NavItem, pageTitles } from '../support/constants/PageTitle';
import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { actions } from '../support/pageObjects/global-po';
import {
  actionsDropdown,
  componentsTabPO,
  integrationTestsTabPO,
  overviewTabPO,
} from '../support/pageObjects/pages-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { AddIntegrationTestPage } from '../support/pages/AddIntegrationTestPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { CreateBuildPage } from '../support/pages/CreateBuildPage';
import { ComponentsTabPage } from '../support/pages/tabs/ComponentsTabPage';
import { OverviewTabPage } from '../support/pages/tabs/OverviewTabPage';
import { Common } from './Common';

export class Applications {
  static deleteApplication(applicationName: string) {
    Common.navigateTo(NavItem.applications);
    this.openKebabMenu(applicationName);
    cy.get(actions.deleteItem).click();
    cy.get(actions.deleteModalInput).clear().type(applicationName);
    cy.get(actions.deleteModalButton).click();
    cy.get(`[data-id="${applicationName}"]`).should('not.exist');
  }

  private static openKebabMenu(applicationName: string) {
    cy.get(`[data-id="${applicationName}"]`).find(actions.kebabButton).click();
  }

  static createApplication(name: string) {
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    cy.testA11y(`${pageTitles.createApp} page`);
    createApplicationPage.setApplicationName(name);
    createApplicationPage.clickNext();
    createApplicationPage.clickNext();
    cy.testA11y(`Select source form`);
  }

  static createComponent(publicGitRepo: string, componentName: string) {
    addComponentStep(publicGitRepo);
    reviewComponentsStep(componentName);
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
  componentPage.editComponentName(`${componentName}-temp`);
  cy.contains('div', `${componentName}-temp`).should('be.visible');

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
