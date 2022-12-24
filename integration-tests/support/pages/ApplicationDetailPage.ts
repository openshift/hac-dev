import { Common } from '../../utils/Common';
import { pageTitles } from '../constants/PageTitle';
import { CPUUnit, MemoryUnit } from '../constants/Units';
import {
  addComponentPagePO,
  buildLogModalContentPO,
  applicationDetailPagePO,
} from '../pageObjects/createApplication-po';
import { actions } from '../pageObjects/global-po';

export class ApplicationDetailPage {
  checkReplica(replicaCount: number) {
    cy.contains('div', applicationDetailPagePO.replicaLabel).should('contain.text', replicaCount);
  }

  checkCpuAndMemory(cpuValue: number, cpuUnit: CPUUnit, ramValue: number, ramUnit: MemoryUnit) {
    const shortCpuUnit = cpuUnit === CPUUnit.core ? '' : 'm';
    cy.contains('div', applicationDetailPagePO.cpuRamLabel).should(
      'contain.text',
      `${cpuValue}${shortCpuUnit}, ${ramValue}${ramUnit}`,
    );
  }

  expandDetails(componentName: string) {
    cy.get(`[aria-label="${componentName}"]`).find(applicationDetailPagePO.detailsArrow).click();
  }

  openComponentSettings(componentName: string) {
    this.openActionList(componentName);
    cy.get(applicationDetailPagePO.componentSettings).click();
    Common.verifyPageTitle(pageTitles.componentSettings);
    Common.waitForLoad();
    cy.testA11y(`${pageTitles.componentSettings} page`);
  }

  checkBuildLog(componentName: string, textToVerify: string) {
    cy.get(`[data-testid="view-build-logs-${componentName}"]`, { timeout: 60000 }).click();
    //verify text
    cy.get(buildLogModalContentPO.closeButton).click();
  }

  createdComponentExists(component: string, application: string) {
    Common.verifyPageTitle(application);
    Common.waitForLoad();
    cy.testA11y('Application details page');
    this.getComponentListItem(component).should('exist');
  }

  createdComponentNotExists(application: string) {
    this.getComponentListItem(application).should('not.exist');
  }

  getComponentListItem(application: string) {
    return cy.get('[data-testid="component-list-item-name"]').contains(application);
  }

  openAddComponentPage() {
    cy.get(addComponentPagePO.addComponent).click({ force: true });
    Common.verifyPageTitle(pageTitles.buildApp);
    Common.waitForLoad();
    cy.testA11y(`${pageTitles.buildApp} page`);
  }

  deleteComponent(componentName: string) {
    this.openActionList(componentName);
    cy.get(actions.deleteItem).click();
    cy.get(actions.deleteModalInput).clear().type(componentName);
    cy.get(actions.deleteModalButton).click();
  }

  private openActionList(componentName: string) {
    cy.get(`[aria-label="${componentName}"]`).find(actions.kebabButton).click();
  }
}
