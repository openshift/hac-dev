// <reference types="cypress" />
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationComponentPage } from '../support/pages/ApplicationComponentsPage';
import { ComponentSamplesPage } from '../support/pages/ComponentSamplesPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { Common } from '../utils/Common';

describe('Create Application from Sample', () => {
  const applicationName = `test-app${new Date().getTime() / 1000}`;

  it('NodeJS app can be created', () => {
    //set application name
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    createApplicationPage.setApplicationName(applicationName);
    createApplicationPage.clickNext();

    // //open app sample page
    new AddComponentPage().openSamplesPage();
    new ComponentSamplesPage().selectNodeJSSampleAndCreate();

    //Review component page
    const applicationPage = new ApplicationComponentPage();
    applicationPage.createApplication();

    //Check application
    applicationPage.createdApplicationExists('basic-node-js');
  });

  it('Add quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //open app sample page
    const addComponent = new AddComponentPage();
    addComponent.openAddComponentPage();
    addComponent.openSamplesPage();
    new ComponentSamplesPage().selectQuarkusSampleAndCreate();

    //Review component page
    const applicationPage = new ApplicationComponentPage();
    applicationPage.createApplication();

    //Check if application exists
    applicationPage.createdApplicationExists('basic-quarkus');
  });

  it('Delete quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //Review component page
    const applicationPage = new ApplicationComponentPage();
    applicationPage.deleteComponent('basic-quarkus');

    //Check if application does not exists
    applicationPage.createdApplicationNotExists('basic-quarkus');
  });
});
