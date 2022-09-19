import { createBuildStepPO } from '../../pageObjects/hacbs-po';

export class CreateBuildPage {
    clickNext() {
        cy.get(createBuildStepPO.next).trigger('click');
    }
}
