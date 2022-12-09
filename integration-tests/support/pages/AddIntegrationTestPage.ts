import { addIntegrationTestStepPO } from '../pageObjects/pages-po';

export class AddIntegrationTestPage {
    enterDisplayName(displayName: string) {
        cy.get(addIntegrationTestStepPO.displayNameInput).clear().type(displayName);
    }
    enterContainerImage(containerImage: string) {
        cy.get(addIntegrationTestStepPO.containerImageInput).clear().type(containerImage);
    }
    enterPipelineName(pipelineName: string) {
        cy.get(addIntegrationTestStepPO.pipelineNameInput).clear().type(pipelineName);
    }
    markOptionalForRelease() {
        cy.get(addIntegrationTestStepPO.optionalreleaseCheckbox).click();
    }
    clickNext() {
        cy.get(addIntegrationTestStepPO.next).trigger('click');
    }
    clickAdd() {
        cy.get(addIntegrationTestStepPO.add).click();
    }
}
