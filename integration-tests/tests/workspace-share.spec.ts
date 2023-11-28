import { NavItem } from '../support/constants/PageTitle';
import { createApplicationPagePO } from '../support/pageObjects/createApplication-po';
import { actions } from '../support/pageObjects/global-po';
import { actionsDropdown } from '../support/pageObjects/pages-po';
import { ComponentsTabPage } from '../support/pages/tabs/ComponentsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { Login } from '../utils/Login';
import { UIhelper } from '../utils/UIhelper';

describe('Workspace sharing', () => {
  const repoLink = 'https://github.com/hac-test/devfile-sample-code-with-quarkus';
  const applicationName = Common.generateAppName();
  const componentName: string = Common.generateAppName('java-quarkus');

  const contributorUser = `contributor-${Cypress.env('HAC_WORKSPACE')}`;
  const contributorUser64 = Buffer.from(contributorUser).toString('base64');
  const base64pass = Buffer.from(Cypress.env('PASSWORD')).toString('base64');

  before(() => {
    cy.exec(
      `python3 keycloak.py ${Cypress.env('HAC_KC_SSO_URL')} ${Cypress.env(
        'HAC_KC_USERNAME',
      )} ${Cypress.env('HAC_KC_PASSWORD')} ${contributorUser64} ${base64pass} ${Cypress.env(
        'HAC_KC_REGISTRATION',
      )}`,
    );
    cy.intercept('GET', '/api/k8s/registration/api/v1/usernames/*', (req) => {
      const username = req.url.slice(req.url.lastIndexOf('/') + 1);
      req.url = `https://registration-service-toolchain-host-operator.apps.hac-devsandbox.5unc.p1.openshiftapps.com/api/v1/usernames/${username}`;
      req.continue();
    });
    Applications.createApplication();
    Applications.createComponent(repoLink, componentName, applicationName);
  });

  it('Grant access to other users', () => {
    Common.navigateTo(NavItem.access);
    cy.contains(`tr`, Cypress.env('HAC_WORKSPACE')).should('contain.text', 'admin');

    cy.contains('a', 'Grant access').click();
    cy.get('h1').should(
      'contain.text',
      `Grant access to workspace, ${Cypress.env('HAC_WORKSPACE')}`,
    );

    cy.get('input[aria-label="Enter username"]').clear().type(contributorUser);
    cy.get('.pf-v5-c-helper-text').should('contain.text', 'Validated');
    cy.contains('button', 'Select role').click();
    cy.contains('a', 'contributor').click();

    cy.get('[data-test="submit-button"]').should('be.enabled').click();
    cy.get('h1').should('have.text', 'User access');

    cy.contains('tr', contributorUser).within(() => {
      cy.contains('td', 'contributor').should('be.visible');
      cy.contains('td', 'Provisioned').should('be.visible');
    });
  });

  describe('Contributor access', () => {
    before(() => {
      Login.switchUser(contributorUser, Cypress.env('PASSWORD'));
      Common.switchWorkspace(Cypress.env('HAC_WORKSPACE'));
      Common.waitForLoad();
    });

    it('Check applications page', () => {
      cy.contains(createApplicationPagePO.createApplication, { timeout: 5000 }).should(
        'have.attr',
        'aria-disabled',
        'true',
      );
      cy.contains(applicationName).should('be.visible');
      Applications.openKebabMenu(applicationName);
      cy.get(`${actions.deleteApp} > button`, { timeout: 5000 }).should(
        'have.attr',
        'aria-disabled',
        'true',
      );
    });

    it('Check application overview permissions', () => {
      cy.contains(applicationName).click();
      Common.waitForLoad();

      cy.contains('button', 'Add component', { timeout: 5000 }).should(
        'have.attr',
        'aria-disabled',
        'true',
      );
      cy.get(actionsDropdown.dropdown).click();
      cy.get('.pf-v5-c-dropdown__menu-item').each((element) => {
        cy.wrap(element, { timeout: 5000 }).should('have.attr', 'aria-disabled', 'true');
      });
    });

    it('Check integration test permissions', () => {
      UIhelper.clickTab('Integration tests');
      cy.get('button[data-test="add-integration-test"]', { timeout: 5000 }).should(
        'have.attr',
        'aria-disabled',
        'true',
      );
      cy.get(actions.kebabButton).click();
      cy.get('.pf-v5-c-menu__item').each((el) => {
        cy.wrap(el, { timeout: 5000 }).should('have.attr', 'aria-disabled', 'true');
      });
    });

    it('Check component permissions', () => {
      UIhelper.clickTab('Components');
      cy.contains('button', 'Add component', { timeout: 5000 }).should(
        'have.attr',
        'aria-disabled',
        'true',
      );
      cy.get(actions.kebabButton).click();
      cy.get('.pf-v5-c-menu__item').each((el) => {
        cy.wrap(el).should('have.attr', 'aria-disabled', 'true');
      });
    });

    it('Check component details permissions', () => {
      ComponentsTabPage.openComponent(componentName);
      cy.contains('button', 'Actions').click();
      cy.get('.pf-v5-c-dropdown__menu-item').each((element) => {
        cy.wrap(element, { timeout: 5000 }).should('have.attr', 'aria-disabled', 'true');
      });
    });
  });
});
