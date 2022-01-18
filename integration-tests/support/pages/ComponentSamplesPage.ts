import { componentSamplesPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class ComponentSamplesPage extends AbstractWizardPage {
  selectNodeJSSampleAndCreate() {
    this.selectSampleAndCreate(componentSamplesPagePO.nodejs);
  }

  selectQuarkusSampleAndCreate() {
    this.selectSampleAndCreate(componentSamplesPagePO.quarkus);
  }

  selectSampleAndCreate(sampleName: string) {
    cy.get(sampleName).click();
    cy.get(componentSamplesPagePO.create).click();
  }

}
