import { Common } from '../../utils/Common';
import { addComponentPagePO, buildLogModalContentPO } from '../pageObjects/createApplication-po';
import { applicationDetailPagePO } from '../pageObjects/createApplication-po';

export class ApplicationDetailPage {
  checkReplica(replicaCount: number) {
    cy.contains('div', applicationDetailPagePO.replicaLabel).should('contain.text', replicaCount)
  }
  checkCpuAndMemory(cpuVal: number, ramValue: number, ramUnit: string) {
    cy.contains('div', applicationDetailPagePO.cpuRamLabel).should('contain.text', `${cpuVal}, ${ramValue}${ramUnit}`);
  }
  expandDetails(componentName: string) {
    cy.get(`[aria-label="${componentName}"]`)
      .find(applicationDetailPagePO.detailsArrow)
      .click();
  }
  openComponentSettings(componentName) {
    this.openActionList(componentName);
    cy.get(applicationDetailPagePO.componentSettings).click();
  }
  checkBuildLog(componentName: string, textToVerify: string) {
    this.openActionList(componentName);
    cy.get(applicationDetailPagePO.componentBuildLog).click();
    //verify text
    cy.get(buildLogModalContentPO.closeButton).click();
  }

  createdComponentExists(application: string) {
    Common.waitSpinner();
    this.getComponentListItem(application).should('exist');
  }

  createdComponentNotExists(application: string) {
    this.getComponentListItem(application).should('not.exist');
  }

  getComponentListItem(application: string) {
    return cy.contains(applicationDetailPagePO.item, application, {timeout: 60000});
  }

  openAddComponentPage() {
    cy.get(addComponentPagePO.addComponent).click();
  }  
  
  deleteComponent(componentName: string) {
    this.openActionList(componentName);
    cy.get(applicationDetailPagePO.componentDelete).click();
  }

  private openActionList(componentName: string) {
    cy.get(`[aria-label="${componentName}"]`)
      .find(applicationDetailPagePO.componentPreferences)
      .click();
  }
}
