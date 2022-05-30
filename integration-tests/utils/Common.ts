import { consentButton, spinner } from '../support/pageObjects/global-po';

export class Common {
  static openAppStudioBaseURL() {
    cy.visit(Cypress.env('HAC_BASE_URL'));
    Common.clickOnConsentButton();
  }

  static openURL(URL: string) {
    cy.visit(URL);
  }

  static openApplicationURL(applicationName: string) {
    Common.openURL(
      `${Cypress.env('HAC_BASE_URL')}/applications?name=${applicationName.replace('.', '-')}`,
    );
  }

  static waitSpinner() {
    cy.get(spinner).should('exist');
    cy.get(spinner).should('not.exist');
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
}
