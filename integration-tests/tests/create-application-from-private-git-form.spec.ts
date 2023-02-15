import { addComponentPagePO, createApplicationPagePO } from '../support/pageObjects/createApplication-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { Tokens } from '../utils/Tokens';

describe('Create Component from Private Git Using Login Form', { tags: ['@PR-check', '@privateRepo'] }, () => {
  const addComponent = new AddComponentPage();
  const componentPage = new ComponentPage();
  const applicationDetailPage = new ApplicationDetailPage();
  const applicationName = Common.generateAppName();
  const privateRepo = 'https://github.com/hac-test/private-repo-check';
  const componentName = `py-${applicationName}`;

  const user = 'hac-test';
  const pass = Cypress.env('GH_PASSWORD');
  const deviceId = '2e478c118996feb7e058965e62fef9fe';

  before(function () {
    Tokens.removeBindingsAndTokens();
    Applications.createApplication(applicationName);
  });

  after(() => {
    Common.openApplicationURL(applicationName);
    Applications.deleteApplication(applicationName);
  });

  describe('Creating Component From Private Github Repo', () => {
    it('Works After Signing in to Github', () => {
      // open any pop ups in the current window, since cypress can only work in a single tab/window
      cy.window().then((win) => {
        cy.stub(win, 'open')
          .callThrough()
          .withArgs(Cypress.sinon.match.string, '_blank')
          .callsFake((...args) => {
            win.open(args[0], '_self');
          });
      });

      // Enter git repo URL
      addComponent.setSource(privateRepo);
      addComponent.waitUnableToAccess();

      // redirect to github for login, then go back to hac
      cy.url().then((url) => {
        cy.contains('button', 'Sign in').wait(500).click({ force: true });
        cy.origin(
          'https://www.github.com',
          { args: { user, pass, deviceId } },
          ({ user, pass, deviceId }) => {
            // bypass the device validation
            cy.get('#login_field').type(user);
            cy.get('#password').type(pass, { log: false });
            cy.clearCookie('_device_id');
            cy.setCookie('_device_id', deviceId, {
              domain: 'github.com',
              path: '/',
              sameSite: 'no_restriction',
              httpOnly: true,
              secure: true,
            });
            cy.getCookie('_device_id').should('have.property', 'value', deviceId);
            cy.get('[value="Sign in"]').click();
          },
        );
        cy.contains('Login successful').should('be.visible');
        cy.visit(url);
      });

      const appPage = new CreateApplicationPage();
      cy.get(createApplicationPagePO.applicationName).invoke('val').should('not.be.empty');
      appPage.setApplicationName(applicationName);
      appPage.clickNext();
      appPage.clickNext();

      addComponent.setSource(privateRepo);
      addComponent.waitRepoValidated();
      cy.get('form').submit();

      componentPage.editComponentName(componentName);
      componentPage.createApplication();
      Applications.goToComponentsTab();
      applicationDetailPage.createdComponentExists(componentName, applicationName);
    });
  });
});
