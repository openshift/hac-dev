import { NavItem, pageTitles } from '../support/constants/PageTitle';
import { loginPO, kcLoginPO } from '../support/pageObjects/global-po';
import { GetStartedPage } from '../support/pages/GetStartedPage';
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

  static logout() {
    cy.clearLocalStorage('sdk/active-workspace');
    cy.get('.pf-v5-c-avatar').click();
    cy.contains('button', 'Log out').click();
  }

  static switchUser(newName: string, newPass: string) {
    this.logout();
    if (Cypress.env('PR_CHECK') || Cypress.env('PERIODIC_RUN')) {
      this.prCheckLogin(newName, newPass);
    } else {
      this.login(newName, newPass);
    }
  }

  private static waitForApps() {
    Common.waitForLoad();
    GetStartedPage.waitForLoad();
    Common.navigateTo(NavItem.applications);
    Common.verifyPageTitle(pageTitles.applications);
    Common.waitForLoad();
    cy.testA11y(`${pageTitles.applications} page`);
  }
}
