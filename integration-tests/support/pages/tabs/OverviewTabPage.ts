import { Common } from "../../../utils/Common";
import { overviewTabPO } from "../../pageObjects/pages-po";

export class OverviewTabPage {
    goToComponentsTab() {
        cy.get(overviewTabPO.goToComponents).click();
    }

    addComponent() {
        Common.waitForLoad();
        cy.wait(500).get(overviewTabPO.addComponent).click({ force: true });
    }
}
