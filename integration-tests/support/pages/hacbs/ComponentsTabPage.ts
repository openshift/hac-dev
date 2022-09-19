import { componentsTabPO } from '../../pageObjects/hacbs-po';

export class ComponentsTabPage {
    clickAddComponent() {
        cy.get(componentsTabPO.addComponent).click();
    }
}
