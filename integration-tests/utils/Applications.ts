import { NavItem, pageTitles } from '../support/constants/PageTitle';
import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { actions, breadcrumb } from '../support/pageObjects/global-po';
import {
  actionsDropdown,
  componentsTabPO,
  pipelinerunsTabPO,
  integrationTestsTabPO,
  overviewTabPO,
  activityTabPO,
  latestCommitsTabPO,
} from '../support/pageObjects/pages-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { AddIntegrationTestPage } from '../support/pages/AddIntegrationTestPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { ComponentsTabPage } from '../support/pages/tabs/ComponentsTabPage';
import { OverviewTabPage } from '../support/pages/tabs/OverviewTabPage';
import { PipelinerunsTabPage } from '../support/pages/tabs/PipelinerunsTabPage';
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
    cy.title().should('eq', 'Applications | CI/CD');
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    cy.title().should('eq', 'Import - Name application | CI/CD');
    cy.testA11y(`${pageTitles.createApp} page`);
    createApplicationPage.setApplicationName(name);
    createApplicationPage.clickNext();
    createApplicationPage.clickNext();
    cy.testA11y(`Select source form`);
  }

  static createComponent(
    publicGitRepo: string,
    componentName: string,
    runtime?: string,
    useCustomBuildPipeline: boolean = false,
  ) {
    addComponentStep(publicGitRepo);
    reviewComponentsStep(componentName, useCustomBuildPipeline, runtime);
  }

  static checkComponentInListView(
    componentName: string,
    applicationName: string,
    componentStatus: string,
    componentLabel: string,
  ) {
    this.createdComponentExists(componentName, applicationName);
    this.checkComponentStatus(componentName, componentStatus);
    this.checkComponentLabel(componentName, componentLabel);
  }

  static createdComponentExists(componentName: string, applicationName: string) {
    this.goToComponentsTab();

    Common.verifyPageTitle(applicationName);
    Common.waitForLoad();
    this.getComponentListItem(componentName).should('exist');
  }

  static checkComponentStatus(componentName: string, componentStatus: string) {
    cy.get(componentsTabPO.componentListItem(componentName)).contains(componentStatus, {
      timeout: 30000,
    });
  }

  static checkComponentLabel(componentName: string, componentLabel: string) {
    cy.get(componentsTabPO.componentListItem(componentName)).contains(componentLabel, {
      timeout: 15000,
    });
  }

  static createdPipelinerunSucceeded(
    pipelinerunName: string,
    isAdvancedFlowActive: boolean = false,
  ) {
    PipelinerunsTabPage.doesPipelinerunExistsInListView(pipelinerunName);
    PipelinerunsTabPage.clickOnPipelinerunFromListView(pipelinerunName);
    PipelinerunsTabPage.checkPipelinerunStatus(isAdvancedFlowActive);
  }

  static getComponentListItem(application: string) {
    return cy.contains(applicationDetailPagePO.item, application, { timeout: 60000 });
  }

  static clickActionsDropdown(dropdownItem: string) {
    cy.get(actionsDropdown.dropdown).click();
    cy.contains(dropdownItem).click();
  }

  static clickBreadcrumbLink(link: string) {
    cy.get(breadcrumb.breadcrumbLink).contains(link).click();
  }

  static goToOverviewTab() {
    cy.get(overviewTabPO.clickTab).click();
    Common.waitForLoad();
    return new OverviewTabPage();
  }

  static goToComponentsTab() {
    cy.get(componentsTabPO.clickTab).click();
    return new ComponentsTabPage();
  }

  static goToActivityTab() {
    cy.get(activityTabPO.clickTab, { timeout: 30000 }).click();
    Common.waitForLoad();
  }

  static goToLatestCommitsTab() {
    this.goToActivityTab();
    cy.get(latestCommitsTabPO.clickTab, { timeout: 30000 }).click();
  }

  static goToPipelinerunsTab() {
    this.goToActivityTab();
    cy.get(pipelinerunsTabPO.clickTab, { timeout: 30000 }).click();
    Common.waitForLoad();
  }

  static goToIntegrationTestsTab() {
    cy.get(integrationTestsTabPO.clickTab).click();
  }
}

function addComponentStep(publicGitRepo: string) {
  const addComponent = new AddComponentPage();
  cy.title().should('eq', 'Import - Add components | CI/CD');

  // Enter git repo URL
  addComponent.setSource(publicGitRepo);
  // Check if the source is validated
  addComponent.waitRepoValidated();
  // Setup Git Options
  addComponent.clickGitOptions();

  addComponent.clickNext();
  cy.title().should('eq', 'Import - Configure components | CI/CD');
}

function reviewComponentsStep(
  componentName: string,
  useCustomBuildPipeline: boolean,
  runtime?: string,
) {
  const componentPage = new ComponentPage();

  // Edit component name
  componentPage.editComponentName(`${componentName}-temp`);
  cy.contains('div', `${componentName}-temp`).should('be.visible');

  // Switch back to orginal name
  componentPage.editComponentName(componentName);
  cy.contains('div', componentName).should('be.visible');

  if (runtime) {
    componentPage.selectRuntime(runtime);
  }

  if (useCustomBuildPipeline) {
    componentPage.selectCustomBuildPipeline();
  }

  componentPage.createApplication(useCustomBuildPipeline);
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
