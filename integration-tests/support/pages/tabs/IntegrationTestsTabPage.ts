import { actions } from "../../pageObjects/global-po";
import { integrationTestsTabPO } from "../../pageObjects/pages-po";

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
}
