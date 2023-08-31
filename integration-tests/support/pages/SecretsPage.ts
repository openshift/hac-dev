import { UIhelper } from '../../utils/UIhelper';
import { actions } from '../pageObjects/global-po';

export class SecretsPage {
  static deleteSecret(secretName: string) {
    UIhelper.getTableRow('Secret List', secretName).find(actions.kebabButton).click();
    cy.get(actions.deleteItem).click();
    UIhelper.inputValueInTextBoxByLabelName(`Type "${secretName}" to confirm deletion`, secretName);
    UIhelper.clickButton('Delete').should('not.exist');
    cy.contains(secretName).should('not.exist');
  }
}
