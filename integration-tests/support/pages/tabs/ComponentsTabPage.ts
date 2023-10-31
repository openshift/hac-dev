import { Common } from '../../../utils/Common';
import { applicationDetailPagePO } from '../../pageObjects/createApplication-po';
import { componentsTabPO } from '../../pageObjects/pages-po';

export class ComponentsTabPage {
  static clickAddComponent() {
    Common.waitForLoad();
    cy.get(componentsTabPO.addComponent).click();
  }

  static getComponentListItem(name: string) {
    return cy.contains(applicationDetailPagePO.item, name, { timeout: 60000 });
  }

  static openComponent(name: string) {
    this.getComponentListItem(name).click();
    Common.waitForLoad();
    cy.contains('h2', name).should('be.visible');
  }
}
