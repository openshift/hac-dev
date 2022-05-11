// <reference types="cypress" />
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationComponentPage } from '../support/pages/ApplicationComponentsPage';
import { ComponentSamplesPage } from '../support/pages/ComponentSamplesPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { BuildApplicationWithGitSourcePage } from '../support/pages/BuildApplicationWithGitSourcePage';
import { Common } from '../utils/Common';

describe('Create Application from Git Source', () => {
  const applicationName = `test-app${new Date().getTime() / 1000}`;

  it('Creating a Quarkus component', () => {
    //set application name
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    createApplicationPage.setApplicationName(applicationName);
    createApplicationPage.clickNext();

    // Enter git repo URL
    const buildApplicationWithGitSourcePage = new BuildApplicationWithGitSourcePage();
    buildApplicationWithGitSourcePage.setSource('https://github.com/dheerajodha/devfile-sample-code-with-quarkus');
    // Check if the source is validated
    buildApplicationWithGitSourcePage.isValidated();
    buildApplicationWithGitSourcePage.clickNext();

    //Review component page
    const applicationPage = new ApplicationComponentPage();
    applicationPage.createApplication();

    //Check application
    applicationPage.createdApplicationExists('1-java-quarkus');
  });

  it('Delete java quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //Review component page
    const applicationPage = new ApplicationComponentPage();
    applicationPage.deleteComponent('1-java-quarkus');

    //Check if application does not exists
    applicationPage.createdApplicationNotExists('1-java-quarkus');
  });
});
