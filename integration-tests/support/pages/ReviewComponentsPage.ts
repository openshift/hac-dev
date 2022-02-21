import { reviewComponentsPagePO } from '../pageObjects/createApplication-po';
import { alertTitle } from '../pageObjects/global-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class ReviewComponentPage extends AbstractWizardPage {
  createApplication() {
    cy.get(reviewComponentsPagePO.create).click();
  }

  checkAlert(message: string) {
    cy.get(alertTitle).contains(message).should('exist');
  }
}
