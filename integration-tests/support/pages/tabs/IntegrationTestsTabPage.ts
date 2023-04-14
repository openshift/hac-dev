import { Applications } from '../../../utils/Applications';
import { Common } from '../../../utils/Common';
import { UIhelper } from '../../../utils/UIhelper';
import { actions } from '../../pageObjects/global-po';
import { integrationTestsTabPO, addIntegrationTestStepPO } from '../../pageObjects/pages-po';

type integrationTableRow = {
  name: string;
  ContainerImage: string;
  optionalForRelease: string;
  pipelines: string;
};

export class IntegrationTestsTabPage {
  filterByName(inputString: string) {
    cy.get(integrationTestsTabPO.filterInputField).clear().type(inputString);
  }

  openAndClickKebabMenu(integrationTestName: string, option: string) {
    cy.get(`[data-id="${integrationTestName}"]`).find(actions.kebabButton).click();
    cy.contains('li', option).click();
  }

  addIntegrationTest(
    integrationTestName: string,
    imageBundle: string,
    pipelineToRun,
    markOptionalForRelease?: string,
  ) {
    this.verifySaveChangesIsDisabled();
    UIhelper.inputValueInTextBoxByLabelName('Integration test name', integrationTestName);
    UIhelper.inputValueInTextBoxByLabelName('Image bundle', imageBundle);
    UIhelper.inputValueInTextBoxByLabelName('Pipeline to run', pipelineToRun);
    if (markOptionalForRelease === 'uncheck') {
      cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).uncheck();
    } else if (markOptionalForRelease === 'check') {
      cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).check();
    }

    UIhelper.clickButton('Add integration test').should('not.exist');
    Common.waitForLoad();
  }

  editIntegrationTest(imageBundle: string, pipelineToRun: string, markOptionalForRelease?: string) {
    this.verifyIntegrationNameIsDisabled();
    this.verifySaveChangesIsDisabled();

    if (imageBundle) {
      UIhelper.inputValueInTextBoxByLabelName('Image bundle', imageBundle);
    }

    if (pipelineToRun) {
      UIhelper.inputValueInTextBoxByLabelName('Pipeline to run', pipelineToRun);
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
    cy.get(addIntegrationTestStepPO.displayNameInput).should('have.attr', 'readonly');
  }

  verifySaveChangesIsDisabled() {
    cy.get(integrationTestsTabPO.saveChangesButton).should('be.disabled');
  }

  verifyRowInIntegrationTestsTable(rowDetails: integrationTableRow) {
    UIhelper.verifyRowInTable('Integration tests', rowDetails.name, [
      new RegExp(rowDetails.ContainerImage),
      new RegExp(`^${rowDetails.optionalForRelease}$`),
      new RegExp(`^${rowDetails.pipelines}$`),
    ]);
  }

  deleteIntegrationTestFromActions() {
    Applications.clickActionsDropdown('Delete');
    UIhelper.clickButton('Delete');
  }
}
