import { addComponentPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class AddComponentPage extends AbstractWizardPage {
  openSamplesPage() {
    cy.contains(addComponentPagePO.samples).click();
  }
  openAddComponentPage() {
    cy.get(addComponentPagePO.addComponent).click();
  }
}
