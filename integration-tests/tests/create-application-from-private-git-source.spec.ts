import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { Tokens } from '../utils/Tokens';

describe('Create Component from Private Git Source', () => {
  const addComponent = new AddComponentPage();
  const componentPage = new ComponentPage();
  const applicationDetailPage = new ApplicationDetailPage();
  const applicationName = Common.generateAppName();
  const privateRepo = 'https://github.com/hac-test/private-repo-check';
  const componentName = 'python';
  const username = 'hac-test';
  const token = Cypress.env("GH_TOKEN");

  before(function () {
    Applications.createApplication(applicationName);
  });

  after(function () {
    Common.openApplicationURL(applicationName);
    Applications.deleteApplication(applicationName);
    Tokens.removeBindingsAndTokens();
  });

  describe('Creating Component', () => {
    it('Validate Repo', () => {
      addComponent.setSource(privateRepo);
      addComponent.waitUnableToAccess();
      addComponent.loginByToken(username, token);
      addComponent.waitRepoValidated(180000);
      addComponent.clickNext();
    });

    it('Create Application', () => {
      componentPage.createApplication();
      applicationDetailPage.createdComponentExists(componentName, applicationName);
    });
  });
});
