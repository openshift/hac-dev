// <reference types="cypress" />
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

// skip on jenkins build due to SPI issues
if (!Cypress.env('PR_CHECK')) {
  describe('Create Component from Quay Image', () => {
    const addComponent = new AddComponentPage();
    const componentPage = new ComponentPage();
    const applicationDetailPage = new ApplicationDetailPage();
    const applicationName = Common.generateAppName();
    const quayImage = 'quay.io/quarkus/code-quarkus-app';
    const componentName = 'code-quarkus-app';
  
    before(function () {
      const createApplicationPage = new CreateApplicationPage();
      createApplicationPage.clickCreateApplication();
      createApplicationPage.setApplicationName(applicationName);
      createApplicationPage.clickNext();
    });
  
    after(function () {
      Common.openApplicationURL(applicationName);
      applicationDetailPage.deleteComponent(componentName);
      applicationDetailPage.createdComponentNotExists(componentName);
      Applications.deleteApplication(applicationName);
    });
  
    describe('Creating a Quay Component', () => {
      it('Validate Repo', () => {
        addComponent.setSource(quayImage);
        addComponent.waitRepoValidated();
        addComponent.clickNext();
      });
  
      it('Create Application', () => {
        componentPage.createApplication();
        applicationDetailPage.createdComponentExists(componentName, applicationName);
      });
    });
  });
}
