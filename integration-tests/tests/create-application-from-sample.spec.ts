import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentSamplesPage } from '../support/pages/ComponentSamplesPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Application from Sample', () => {
  const applicationName = Common.generateAppName();
  var nodejsComponentName;
  var quarkusComponentName;
  const applicationDetailPage = new ApplicationDetailPage();
  const componentPage = new ComponentPage();
  const addComponent = new AddComponentPage();
  const componentSamplesPage = new ComponentSamplesPage();

  before(() => {
    // Disable HACBS
    localStorage.setItem('hacbs', 'false');
    // Need to reload the page after enabling HACBS via localStorage
    cy.reload();
  });

  it('NodeJS app can be created', () => {
    //set application name
    Applications.createApplication(applicationName);

    //Open app sample page
    addComponent.openSamplesPage();
    componentSamplesPage.selectNodeJSSample();

    // Create sample component
    componentPage.createApplication();

    nodejsComponentName = Applications.getComponentName();
    cy.log(nodejsComponentName);

    //Check application
    applicationDetailPage.createdComponentExists(
      nodejsComponentName,
      applicationName
    );

    // cy.get(applicationDetailPagePO.nodejsComponentPO).then(($ele) => {
    //   nodejsComponentName = $ele.text();
    //   cy.log(nodejsComponentName);

    //   //Check application
    //   applicationDetailPage.createdComponentExists(
    //     nodejsComponentName,
    //     applicationName,
    //   );
    // });
  });

  it('Add quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //open app sample page
    applicationDetailPage.openAddComponentPage();
    addComponent.openSamplesPage();
    componentSamplesPage.selectQuarkusSample();

    // Create sample component
    componentPage.createApplication();

    quarkusComponentName = Applications.getComponentName();
    cy.log(quarkusComponentName);

    //Check application
    applicationDetailPage.createdComponentExists(
      quarkusComponentName,
      applicationName
    );

    // cy.get(applicationDetailPagePO.quarkusComponentPO).then(($ele) => {
    //   quarkusComponentName = $ele.text();
    //   cy.log(quarkusComponentName);

    //   //Check if application exists
    //   applicationDetailPage.createdComponentExists(
    //     quarkusComponentName,
    //     applicationName,
    //   );
    // });
  });

  it('Delete quarkus component', () => {
    //Open components page
    Common.openApplicationURL(applicationName);
    //Review component page
    cy.log(quarkusComponentName);
    applicationDetailPage.deleteComponent(quarkusComponentName);

    //Check if application does not exists
    applicationDetailPage.createdComponentNotExists(quarkusComponentName);
  });

  it('Delete application with existing component', () => {
    Applications.deleteApplication(applicationName);
  });
});
