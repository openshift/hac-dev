import { Applications } from '../../../utils/Applications';
import { Common } from '../../../utils/Common';
import { UIhelper } from '../../../utils/UIhelper';
import { actions } from '../../pageObjects/global-po';
import { integrationTestsTabPO, addIntegrationTestStepPO } from '../../pageObjects/pages-po';

type integrationTableRow = {
  name: string;
  githubURL: string;
  optionalForRelease: string;
  revision: string;
};

export class IntegrationTestsTabPage {
  filterByName(inputString: string) {
    cy.get(integrationTestsTabPO.filterInputField).clear().type(inputString);
  }

  hasIntegrationTest(integrationTestName: string) {
    UIhelper.verifyRowInTable('Integration tests', integrationTestName, [integrationTestName]);
  }

  openAndClickKebabMenu(integrationTestName: string, option: string) {
    cy.get(`[data-id="${integrationTestName}"]`).find(actions.kebabButton).click();
    cy.contains('li', option).click();
  }

  addIntegrationTest(
    integrationTestName: string,
    githubURL: string,
    revision: string,
    pathInRepository: string,
    markOptionalForRelease?: string,
  ) {
    this.verifySaveChangesIsDisabled();
    UIhelper.inputValueInTextBoxByLabelName('Integration test name', integrationTestName);
    UIhelper.inputValueInTextBoxByLabelName('GitHub URL', githubURL);
    cy.contains(addIntegrationTestStepPO.accessValidationMsg, 'Access validated', {
      timeout: 80000,
    }).should('be.visible');
    UIhelper.inputValueInTextBoxByLabelName('Revision', revision);
    UIhelper.inputValueInTextBoxByLabelName('Path in repository', pathInRepository);
    if (markOptionalForRelease === 'uncheck') {
      cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).uncheck();
    } else if (markOptionalForRelease === 'check') {
      cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).check();
    }

    UIhelper.clickButton('Add integration test').should('not.exist');
    Common.waitForLoad();
  }

  editIntegrationTest(githubURL: string, markOptionalForRelease?: string) {
    this.verifyIntegrationNameIsDisabled();
    this.verifySaveChangesIsDisabled();

    if (githubURL) {
      UIhelper.inputValueInTextBoxByLabelName('GitHub URL', githubURL);
      cy.contains(addIntegrationTestStepPO.accessValidationMsg, 'Access validated', {
        timeout: 80000,
      }).should('be.visible');
    }

    if (markOptionalForRelease === 'uncheck')
      cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).uncheck();
    else if (markOptionalForRelease === 'check')
      cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).check();

    cy.get(integrationTestsTabPO.saveChangesButton).click().should('not.exist');
    Common.waitForLoad();
  }

  clickOnAddIntegrationTestBtn() {
    UIhelper.clickButton('Add integration test').should('not.exist');
  }

  verifyIntegrationNameIsDisabled() {
    cy.get(addIntegrationTestStepPO.displayNameInput).should('have.attr', 'disabled');
  }

  verifySaveChangesIsDisabled() {
    cy.get(integrationTestsTabPO.saveChangesButton).should('be.disabled');
  }

  verifyRowInIntegrationTestsTable(rowDetails: integrationTableRow) {
    UIhelper.verifyRowInTable('Integration tests', rowDetails.name, [
      new RegExp(rowDetails.githubURL),
      new RegExp(`^\\s*${rowDetails.optionalForRelease}\\s*$`),
      new RegExp(`^\\s*${rowDetails.revision}\\s*$`),
    ]);
  }

  deleteIntegrationTestFromActions() {
    Applications.clickActionsDropdown('Delete');
    UIhelper.clickButton('Delete');
  }
}
