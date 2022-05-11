import { createApplicationPagePO } from '../pageObjects/createApplication-po';
import { buildApplicationWithGitSourcePagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class BuildApplicationWithGitSourcePage extends AbstractWizardPage {
  setSource(source: string) {
    this.clearSourceField();
    cy.get(buildApplicationWithGitSourcePagePO.enterSource).type(source);
  }

  clearSourceField() {
    cy.get(buildApplicationWithGitSourcePagePO.enterSource).clear();
  }

  isValidated() {
      cy.get(buildApplicationWithGitSourcePagePO.validated).should('have.text', 'Validated')
  }

  clickGitOptions() {
    cy.contains(buildApplicationWithGitSourcePagePO.gitOptions).click();
  }

  setGitReference(gitReference: string) {
    this.clearGitReference();
    cy.get(buildApplicationWithGitSourcePagePO.gitReference).type(gitReference);
  }

  clearGitReference() {
    cy.get(buildApplicationWithGitSourcePagePO.gitReference).clear();
  }

  setContextDir(contextDir: string) {
    this.clearContextDir();
    cy.get(buildApplicationWithGitSourcePagePO.contextDir).type(contextDir);
  }

  clearContextDir() {
    cy.get(buildApplicationWithGitSourcePagePO.contextDir).clear();
  }

  clickNext() {
    cy.get(createApplicationPagePO.next).click();
  }
}
