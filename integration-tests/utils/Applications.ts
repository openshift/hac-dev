import { NavItem } from '../support/constants/PageTitle';
import { actions } from '../support/pageObjects/global-po';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { Common } from './Common';

export class Applications {
  static deleteApplication(applicationName: string) {
    Common.navigateTo(NavItem.applications);
    this.openKebabMenu(applicationName);
    cy.get(actions.deleteItem).click();
    cy.get(actions.deleteModalInput).clear().type(applicationName);
    cy.get(actions.deleteModalButton).click();
    cy.get(`[data-id="${applicationName}"]`).should('not.exist');
  }

  private static openKebabMenu(applicationName: string) {
    cy.get(`[data-id="${applicationName}"]`).find(actions.kebabButton).click();
  }

  static createApplication(name: string) {
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    createApplicationPage.setApplicationName(name);
    createApplicationPage.clickNext();
  }
}
