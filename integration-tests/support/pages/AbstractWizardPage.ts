import { formPO } from '../pageObjects/global-po';

export class AbstractWizardPage {
  clickNext() {
    cy.get(formPO.create).click();
  }

  clickCancel() {
    cy.get(formPO.cancel).click();
  }
}
