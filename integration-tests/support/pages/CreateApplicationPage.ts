import { createApplicationPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class CreateApplicationPage extends AbstractWizardPage {
  getApplicationName() {
    return cy.get(createApplicationPagePO.applicationName);
  }

  setApplicationName(name: string) {
    this.clearApplicationName();
    cy.get(createApplicationPagePO.applicationName).type(name);
  }

  clearApplicationName() {
    cy.get(createApplicationPagePO.applicationName).clear();
  }

  clickNext() {
    cy.get(createApplicationPagePO.next).click();
  }
}
