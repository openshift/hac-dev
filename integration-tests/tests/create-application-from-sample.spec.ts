import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentSamplesPage } from '../support/pages/ComponentSamplesPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Application from Sample', () => {
  const applicationName = Common.generateAppName();
  const applicationDetailPage = new ApplicationDetailPage();
  const componentPage = new ComponentPage();
  const addComponent = new AddComponentPage();
  const componentSamplesPage = new ComponentSamplesPage();
  const publicRepos = [
    'https://github.com/nodeshift-starters/devfile-sample.git',
    'https://github.com/devfile-samples/devfile-sample-code-with-quarkus.git'
  ];

  before(() => {
    // Disable HACBS
    localStorage.setItem('hacbs', 'false');
    // Need to reload the page after enabling HACBS via localStorage
    cy.reload();
  });

  beforeEach(function () {
    cy.intercept(
      {
        method: 'GET',
        url: /^.*\/namespaces\/[A-za-z0-9-]+\/components\?limit=250.*$/,
      }
    ).as('componentsAPI');
  });

  it('NodeJS app can be created', () => {
    //set application name
    Applications.createApplication(applicationName);

    //Open app sample page
    addComponent.openSamplesPage();
    componentSamplesPage.selectNodeJSSample();

    // Create sample component
    componentPage.createApplication();

    cy.wait('@componentsAPI').then((xhr) => {
      for (let item of xhr.response.body.items) {
        if (item.spec.source.git.url == publicRepos[0]) {
          applicationDetailPage.createdComponentExists(item.spec.componentName, applicationName);
        }
      }
    });
  });

  it('Add and then delete a quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //open app sample page
    applicationDetailPage.openAddComponentPage();
    addComponent.openSamplesPage();
    componentSamplesPage.selectQuarkusSample();

    // Create sample component
    componentPage.createApplication();

    cy.wait('@componentsAPI').then((xhr) => {
      for (let item of xhr.response.body.items) {
        if (item.spec.source.git.url == publicRepos[1]) {
          var quarkusComponentName = item.spec.componentName;

          //Check if component exists
          applicationDetailPage.createdComponentExists(quarkusComponentName, applicationName);

          //Open components page
          Common.openApplicationURL(applicationName);
          applicationDetailPage.deleteComponent(quarkusComponentName);

          //Check if component does not exists
          applicationDetailPage.createdComponentNotExists(quarkusComponentName);
        }
      }
    });
  });

  it('Delete application with existing component', () => {
    Applications.deleteApplication(applicationName);
  });
});
