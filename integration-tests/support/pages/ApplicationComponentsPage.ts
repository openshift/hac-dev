import { applicationComponentsPagePO } from '../pageObjects/createApplication-po';
import { alertTitle } from '../pageObjects/global-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class ApplicationComponentPage extends AbstractWizardPage {
  createApplication() {
    cy.get(applicationComponentsPagePO.create).click();
  }

  checkAlert(message: string) {
    cy.get(alertTitle).contains(message).should('exist');
  }

  createdApplicationExists(application: string) {
    this.getComponentListItem(application).should('exist');
  }

  createdApplicationNotExists(application: string) {
    this.getComponentListItem(application).should('not.exist');
  }

  getComponentListItem(application: string) {
    return cy.get(applicationComponentsPagePO.item).contains(application);
  }

  deleteComponent(componentName: string) {
    cy.get(`[aria-label="${componentName}"]`)
      .find(applicationComponentsPagePO.componentPreferences)
      .click();
    cy.get(applicationComponentsPagePO.componentDelete).click();
  }
}
