import { addComponentPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class AddComponentPage extends AbstractWizardPage {
  openSamplesPage() {
    cy.get(addComponentPagePO.samples).click();
  }
}
