// <reference types="cypress" />
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Component from Private Quay Image', () => {
  const addComponent = new AddComponentPage();
  const componentPage = new ComponentPage();
  const applicationDetailPage = new ApplicationDetailPage();
  const applicationName = Common.generateAppName();
  const quayImage = 'quay.io/hacdev/quarkus-private';
  const componentName = 'quarkus-private';
  const username = 'hacdev+hac_dev_bot';
  const token = Cypress.env('QUAY_TOKEN');

  before(() => {
    Applications.createApplication(applicationName);
  });

  after(() => {
    Common.openApplicationURL(applicationName);
    Applications.deleteApplication(applicationName);
  });

  describe('Creating a Quay Component', () => {
    it('Validate Repo', () => {
      addComponent.setSource(quayImage);
      addComponent.loginByToken(username, token);
      addComponent.waitRepoValidated();
      addComponent.clickNext();
    });

    it('Create Application', () => {
      componentPage.createApplication();
      applicationDetailPage.createdComponentExists(componentName, applicationName);
    });
  });
});
