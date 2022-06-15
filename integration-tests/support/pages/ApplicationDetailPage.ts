import { Common } from '../../utils/Common';
import { pageTitles } from '../constants/PageTitle';
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

  checkCpuAndMemory(cpuVal: number, ramValue: number, ramUnit: string) {
    cy.contains('div', applicationDetailPagePO.cpuRamLabel).should(
      'contain.text',
      `${cpuVal}, ${ramValue}${ramUnit}`,
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
  }

  checkBuildLog(componentName: string, textToVerify: string) {
    this.openActionList(componentName);
    cy.get(applicationDetailPagePO.componentBuildLog).click();
    //verify text
    cy.get(buildLogModalContentPO.closeButton).click();
  }

  createdComponentExists(component: string, application: string) {
    Common.verifyPageTitle(application);
    Common.waitForLoad();
    this.getComponentListItem(component).should('exist');
  }

  createdComponentNotExists(application: string) {
    this.getComponentListItem(application).should('not.exist');
  }

  getComponentListItem(application: string) {
    return cy.contains(applicationDetailPagePO.item, application, { timeout: 60000 });
  }

  openAddComponentPage() {
    cy.get(addComponentPagePO.addComponent).click();
    Common.verifyPageTitle(pageTitles.buildApp);
    Common.waitForLoad();
  }

  deleteComponent(componentName: string) {
    this.openActionList(componentName);
    cy.get(actions.deleteItem).click();
    cy.get(actions.deleteModalInput).clear().type(componentName);
    cy.get(actions.deleteModalButton).click();
  }

  private openActionList(componentName: string) {
    cy.get(`[aria-label="${componentName}"]`)
      .find(actions.kebabButton)
      .click();
  }
}
