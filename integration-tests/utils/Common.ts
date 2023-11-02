import { NavItem } from '../support/constants/PageTitle';
import { consentButton, navigation, waits } from '../support/pageObjects/global-po';

export class Common {
  static openAppStudioBaseURL() {
    cy.visit(Cypress.env('HAC_BASE_URL'));
  }

  static navigateTo(link: NavItem) {
    for (const item in NavItem) {
      cy.get(navigation.sideNavigation(NavItem[item]), { timeout: 30000 }).should('be.visible');
    }
    cy.get(navigation.sideNavigation(link)).click();
    Common.waitForLoad();
  }

  static openURL(URL: string) {
    cy.url().then(($url) => {
      if ($url !== URL) {
        cy.visit(URL);
      }
    });
  }

  static generateAppName(prefix = 'test-app') {
    const name = `${prefix}-${new Date().getTime()}`;
    return name.substring(0, name.length - 4);
  }

  static openApplicationURL(applicationName: string) {
    const workspacePathMatcher = new RegExp(/workspaces\/([^/]+)/);
    cy.url().then((url) => {
      const [, workspace = ''] = url.match(workspacePathMatcher) || [];

      Common.openURL(
        `${Cypress.env(
          'HAC_BASE_URL',
        )}/workspaces/${workspace}/applications/${applicationName.replace('.', '-')}`,
      );
      Common.verifyPageTitle(applicationName);
      Common.waitForLoad();
    });
  }

  static waitForLoad(timeout = 120000) {
    for (const item of Object.values(waits)) {
      cy.get(item, { timeout }).should('not.exist');
    }
  }

  static verifyPageTitle(title: string) {
    cy.contains('h1', title, { timeout: 180000 }).should('be.visible');
  }

  static clickOnConsentButton() {
    cy.get('body')
      .find(consentButton)
      .its('length')
      .then((res) => {
        if (res > 0) {
          cy.get(consentButton).click();
        }
      });
  }

  static cleanNamespace() {
    if (Cypress.env('CLEAN_NAMESPACE') === 'true') {
      cy.exec('export KUBECONFIG=~/.kube/appstudio-config && ./delete-script.sh', {
        timeout: 600000,
      })
        .its('stdout')
        .should('contain', 'Done running the script');
    }
  }

  static getOrigin() {
    return new URL(Cypress.env('HAC_BASE_URL')).origin;
  }

  static checkRowValues(locator: string, valuesToAssert: string[]) {
    for (const value of valuesToAssert) {
      cy.contains(`[data-id="${locator}"]`, value, { timeout: 20000 }).should('exist');
    }
  }

  static getGitHub2FAOTP(): string {
    const secret = Cypress.env('GH_SETUP_KEY');
    const token = require('otplib').authenticator.generate(secret);
    return token;
  }
}
