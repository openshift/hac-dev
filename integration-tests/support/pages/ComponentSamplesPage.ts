import { Common } from '../../utils/Common';
import { componentSamplesPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';

export class ComponentSamplesPage extends AbstractWizardPage {
  selectNodeJSSample() {
    this.selectSample(componentSamplesPagePO.nodejs);
  }

  selectQuarkusSample() {
    this.selectSample(componentSamplesPagePO.quarkus);
  }

  selectSample(sampleName: string) {
    cy.get(componentSamplesPagePO.sample(sampleName)).within(() => {
      cy.get(componentSamplesPagePO.import(sampleName)).click();
    });
    cy.contains('Importing sample...').should('not.exist');
    Common.waitForLoad();
  }
}
