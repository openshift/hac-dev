import { actions } from "../../pageObjects/global-po";
import { integrationTestsTabPO, addIntegrationTestStepPO } from "../../pageObjects/pages-po";

export class IntegrationTestsTabPage {
    checkRowValues(integrationTestName: string, containerImage: string, releaseStatus: string, pipelineName: string) {
        cy.contains(`[data-id="${integrationTestName}"]`, containerImage).should('exist');
        cy.contains(`[data-id="${integrationTestName}"]`, releaseStatus).should('exist');
        cy.contains(`[data-id="${integrationTestName}"]`, pipelineName).should('exist');
    }

    filterByName(inputString: string) {
        cy.get(integrationTestsTabPO.filterInputField).clear().type(inputString);
    }

    deleteIntegrationTest(name: string) {
        this.openKebabMenu(name);
        cy.get(actions.deleteItem).click();
        cy.get(actions.deleteModalInput).clear().type(name);
        cy.get(actions.deleteModalButton).click();
        cy.get(`[data-id="${name}"]`).should('not.exist');
    }

    openKebabMenu(applicationName: string) {
        cy.get(`[data-id="${applicationName}"]`).find(actions.kebabButton).click();
    }

    checkMetadata(listOfMetadata: string[]) {
        for (let metadata of listOfMetadata) {
            cy.get('div').should('contain', metadata);
        }
    }
    editIntegrationTest(imagebundle?: string, pipelineName?: string, markOptionalForRelease?: string) {
        this.verifyIntegrationNameIsDisabled()
        this.verifySaveChangesIsDisabled()

        if(imagebundle)
            cy.get(addIntegrationTestStepPO.displayNameInput).clear().type(imagebundle);

        if (pipelineName)
            cy.get(addIntegrationTestStepPO.pipelineNameInput).clear().type(pipelineName);

        if(markOptionalForRelease == 'uncheck')
            cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).uncheck();
        else if (markOptionalForRelease == 'check')
            cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).check();

        cy.get(integrationTestsTabPO.saveChangesButton).click().should('not.exist')

    }

    verifyLabelAndValue(label: string, value: string) {
        cy.contains('div', label).contains('dd', value)
    }

    verifyIntegrationNameIsDisabled() {
        cy.get(addIntegrationTestStepPO.displayNameInput).should('have.attr', 'readonly');
    }

    verifySaveChangesIsDisabled() {
        cy.get(integrationTestsTabPO.saveChangesButton).should('be.disabled')
    }

}
