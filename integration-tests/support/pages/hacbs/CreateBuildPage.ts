import { createBuildStepPO } from '../../pageObjects/hacbs-po';

export class CreateBuildPage {
    confirmSuccessfulPRMerge() {
        cy.get(createBuildStepPO.mergedCountHelperText, { timeout: 120000 }).should('have.text', '1 of 1 merged');
        cy.get(createBuildStepPO.statusPRMerged).should('be.visible');
        cy.get(createBuildStepPO.mergePRButton).should('have.attr', 'aria-disabled', 'true');
    }

    clickNext() {
        cy.get(createBuildStepPO.next).trigger('click');
    }
}
