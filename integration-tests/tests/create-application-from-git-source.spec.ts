// <reference types="cypress" />
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationComponentPage } from '../support/pages/ApplicationComponentsPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { Common } from '../utils/Common';

describe('Create Component from Git Source', () => {
  const applicationName = `test-app${new Date().getTime() / 1000}`;

  before(function() {
    //set application name
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    createApplicationPage.setApplicationName(applicationName);
    createApplicationPage.clickNext();
  });

  after(function() {
    //Open components page
    Common.openApplicationURL(applicationName);
    //Review component page
    const applicationPage = new ApplicationComponentPage();
    applicationPage.deleteComponent('1-java-quarkus');

    //Check if application does not exists
    applicationPage.createdApplicationNotExists('1-java-quarkus');
  });

  it('Creating a Quarkus component', () => {
    // Enter git repo URL
    const addComponent = new AddComponentPage();
    addComponent.setSource('https://github.com/dheerajodha/devfile-sample-code-with-quarkus');
    // Check if the source is validated
    addComponent.isValidated();
    addComponent.clickNext();

    //Review component page
    const applicationPage = new ApplicationComponentPage();
    applicationPage.createApplication();

    //Check application
    applicationPage.createdApplicationExists('1-java-quarkus');
  });
});
