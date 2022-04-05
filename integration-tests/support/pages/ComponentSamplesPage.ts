import { componentSamplesPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class ComponentSamplesPage extends AbstractWizardPage {
  selectNodeJSSampleAndCreate() {
    cy.get(componentSamplesPagePO.nodejs).click();
    cy.get(componentSamplesPagePO.create).click();
  }
}
