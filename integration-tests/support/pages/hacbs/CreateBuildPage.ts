import { createBuildStepPO } from '../../pageObjects/hacbs-po';

export class CreateBuildPage {
  clickNext() {
    cy.get(createBuildStepPO.next).click({ force: true });
  }
}
