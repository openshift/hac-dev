// <reference types="cypress" />
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { ComponentSamplesPage } from '../support/pages/ComponentSamplesPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { Common } from '../utils/Common';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';

describe('Create Application from Sample', () => {
  const applicationName = `test-app${new Date().getTime() / 1000}`;
  const applicationDetailPage = new ApplicationDetailPage();
  const componentPage = new ComponentPage();
  const addComponent = new AddComponentPage();
  const componentSamplesPage = new ComponentSamplesPage();

  it('NodeJS app can be created', () => {
    //set application name
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    createApplicationPage.setApplicationName(applicationName);
    createApplicationPage.clickNext();

    //Open app sample page
    addComponent.openSamplesPage();
    componentSamplesPage.selectNodeJSSampleAndCreate();

    //Review component page
    componentPage.createApplication();

    //Check application
    applicationDetailPage.createdComponentExists('basic-node-js');
  });

  it('Add quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //open app sample page
    applicationDetailPage.openAddComponentPage();
    addComponent.openSamplesPage();
    componentSamplesPage.selectQuarkusSampleAndCreate();

    //Review component page
    componentPage.createApplication();

    //Check if application exists
    applicationDetailPage.createdComponentExists('basic-quarkus');
  });

  it('Delete quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //Review component page
    applicationDetailPage.deleteComponent('basic-quarkus');

    //Check if application does not exists
    applicationDetailPage.createdComponentNotExists('basic-quarkus');
  });
});
