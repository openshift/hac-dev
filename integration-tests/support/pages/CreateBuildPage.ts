import { createBuildStepPO } from '../pageObjects/pages-po';

export class CreateBuildPage {
  clickNext() {
    cy.get(createBuildStepPO.next).click({ force: true });
  }
}
