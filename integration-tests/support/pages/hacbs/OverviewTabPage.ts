import { overviewTabPO } from '../../pageObjects/hacbs-po';

export class OverviewTabPage {
    goToComponentsTab() {
        cy.get(overviewTabPO.goToComponents).click();
    }

    addComponent() {
        cy.get(overviewTabPO.addComponent).click();
    }
}
