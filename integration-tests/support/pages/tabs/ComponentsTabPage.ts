import { Common } from '../../../utils/Common';
import { componentsTabPO } from '../../pageObjects/pages-po';

export class ComponentsTabPage {
    clickAddComponent() {
        Common.waitForLoad();
        cy.get(componentsTabPO.addComponent).click();
    }
}
