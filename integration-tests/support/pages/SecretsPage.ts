import { UIhelper } from '../../utils/UIhelper';
import { actions } from '../pageObjects/global-po';

export class SecretsPage {
  static searchSecret(secretName: string) {
    cy.get('[name="nameInput"]').clear().type(secretName);
  }

  static deleteSecret(secretName: string) {
    UIhelper.getTableRow('Secret List', secretName).find(actions.kebabButton).click();
    cy.get(actions.delete).click();
    UIhelper.inputValueInTextBoxByLabelName(`Type "${secretName}" to confirm deletion`, secretName);
    UIhelper.clickButton('Delete').should('not.exist');
    cy.contains(secretName).should('not.exist');
  }
}
