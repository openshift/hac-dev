import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { Tokens } from '../utils/Tokens';

describe(
  'Create Component from Private Git Source',
  { tags: ['@PR-check', '@privateRepo'] },
  () => {
    const addComponent = new AddComponentPage();
    const componentPage = new ComponentPage();
    const applicationDetailPage = new ApplicationDetailPage();
    const applicationName = Common.generateAppName();
    const privateRepo = 'https://github.com/hac-test/private-repo-check';
    const componentName = `py-${applicationName}`;
    const username = Cypress.env('GH_USERNAME');
    const token = Cypress.env('GH_TOKEN');

    before(function () {
      Tokens.removeBindingsAndTokens();
      Applications.createApplication(applicationName);
    });

    after(function () {
      Applications.deleteApplication(applicationName);
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
        componentPage.editComponentName(componentName);
        componentPage.createApplication();
        Applications.goToComponentsTab();
        applicationDetailPage.createdComponentExists(componentName, applicationName);
      });
    });
  },
);
