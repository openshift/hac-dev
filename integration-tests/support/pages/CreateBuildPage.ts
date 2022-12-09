import { createBuildStepPO } from '../pageObjects/pages-po';

export class CreateBuildPage {
    clickNext() {
        cy.get(createBuildStepPO.next).trigger('click');
    }
}
