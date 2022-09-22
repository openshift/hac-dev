import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Component from Private Git Source', () => {
  const addComponent = new AddComponentPage();
  const componentPage = new ComponentPage();
  const applicationDetailPage = new ApplicationDetailPage();
  const applicationName = Common.generateAppName();
  const privateRepo = 'https://github.com/hac-test/private-repo-check';
  const componentName = 'python';

  before(function () {
    //set application name
    Applications.createApplication(applicationName);
  });

  after(function () {
    //Open components page
    Common.openApplicationURL(applicationName);
    Applications.deleteApplication(applicationName);
  });

  describe('Creating Component', () => {
    it('Validate Repo', () => {
      // Enter git repo URL
      addComponent.setSource(privateRepo);
      addComponent.waitUnableToAccess();
      addComponent.loginToGitubByToken();
      // Check if the source is validated
      addComponent.waitRepoValidated(120000);
      addComponent.clickNext();
    });

    it('Create Application', () => {
      componentPage.createApplication();
      applicationDetailPage.createdComponentExists(componentName, applicationName);
    });
  });
});
