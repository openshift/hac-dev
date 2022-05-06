import { loginPO, kcLoginPO } from '../support/pageObjects/global-po';

export class Login {
  static login(
    username: string = Cypress.env('USERNAME'),
    password: string = Cypress.env('PASSWORD'),
  ) {
    cy.visit(Cypress.env('HAC_BASE_URL'));
    cy.get(loginPO.usernameForm);
    cy.get(loginPO.username).find('[type="text"]').type(username);
    cy.get(loginPO.nextButton).click();
    cy.get(loginPO.password).find('[type="password"]').type(password);
    cy.get(loginPO.loginButton).click();
  }

  static pr_check_login(
    username: string = Cypress.env('USERNAME'),
    password: string = Cypress.env('PASSWORD'),
  ) {
    cy.visit(Cypress.env('HAC_BASE_URL'));
    cy.get(kcLoginPO.username).type(username);
    cy.get(kcLoginPO.password).type(password);
    cy.get(kcLoginPO.loginButton).click();
  }
}
