import { Common } from '../../../../utils/Common';
import { componentsTabPO } from '../../../pageObjects/hacbs-po';

export class ComponentsTabPage {
    clickAddComponent() {
        Common.waitForLoad();
        cy.get(componentsTabPO.addComponent).click();
    }
}
