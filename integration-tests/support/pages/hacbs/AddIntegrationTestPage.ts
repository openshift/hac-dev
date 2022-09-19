import { addIntegrationStepPO } from '../../pageObjects/hacbs-po';

export class AddIntegrationTestPage {
    enterDisplayName(displayName: string) {
        cy.get(addIntegrationStepPO.displayNameInput).clear().type(displayName);
    }
    enterContainerImage(containerImage: string) {
        cy.get(addIntegrationStepPO.containerImageInput).clear().type(containerImage);
    }
    enterPipelineName(pipelineName: string) {
        cy.get(addIntegrationStepPO.pipelineNameInput).clear().type(pipelineName);
    }
    clickNext() {
        cy.get(addIntegrationStepPO.next).trigger('click');
    }
}
