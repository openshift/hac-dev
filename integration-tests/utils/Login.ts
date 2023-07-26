import { NavItem, pageTitles } from '../support/constants/PageTitle';
import { loginPO, kcLoginPO } from '../support/pageObjects/global-po';
import { Common } from './Common';

export class Login {
  static login(
    username: string = Cypress.env('USERNAME'),
    password: string = Cypress.env('PASSWORD'),
  ) {
    cy.visit(Cypress.env('HAC_BASE_URL'));
    cy.get(loginPO.usernameForm);
    cy.get(loginPO.username).find('[type="text"]').type(username);
    cy.get(loginPO.nextButton).click();
    cy.get(loginPO.password).find('[type="password"]').type(password, { log: false });
    cy.get(loginPO.loginButton).click();
    this.waitForApps();
  }

  static prCheckLogin(
    username: string = Cypress.env('USERNAME'),
    password: string = Cypress.env('PASSWORD'),
  ) {
    cy.visit(Cypress.env('HAC_BASE_URL'));
    cy.get(kcLoginPO.username).type(username);
    cy.get(kcLoginPO.password).type(password, { log: false });
    cy.get(kcLoginPO.loginButton).click();
    this.waitForApps();
  }

  private static waitForApps() {
    Common.waitForLoad();
    Common.verifyPageTitle(pageTitles.overviewPage);
    Common.navigateTo(NavItem.applications);
    Common.verifyPageTitle(pageTitles.applications);
    Common.waitForLoad();
    cy.testA11y(`${pageTitles.applications} page`);
  }
}
