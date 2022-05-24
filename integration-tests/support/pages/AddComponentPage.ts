import { addComponentPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class AddComponentPage extends AbstractWizardPage {
  openSamplesPage() {
    cy.contains(addComponentPagePO.samples).click();
  }
  openAddComponentPage() {
    cy.get(addComponentPagePO.addComponent).click();
  }
  setSource(source: string) {
    cy.get(addComponentPagePO.enterSource).clear().type(source);
  }

  isValidated() {
      cy.contains('div', 'Validated')
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
