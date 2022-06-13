import { Common } from '../../utils/Common';
import { pageTitles } from '../constants/PageTitle';
import { addComponentPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';

export class AddComponentPage extends AbstractWizardPage {
  waitRepoValidated() {
    cy.contains('div', 'Validated', {timeout: 60000});
  }

  openSamplesPage() {
    cy.contains(addComponentPagePO.samples).click();
    Common.verifyPageTitle(pageTitles.sampleStart);
    Common.waitForLoad();
  }

  setSource(source: string) {
    cy.get(addComponentPagePO.enterSource).clear().type(source);
  }

  clickGitOptions() {
    cy.contains(addComponentPagePO.gitOptions).click();
  }

  setGitReference(gitReference: string) {
    cy.get(addComponentPagePO.gitReference).clear().type(gitReference);
  }

  setContextDir(contextDir: string) {
    cy.get(addComponentPagePO.contextDir).clear().type(contextDir);
  }

  clickNext() {
    cy.get(addComponentPagePO.next).click();
  }
}
