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

  it('NodeJS app can be created', () => {
    //set application name
    Applications.createApplication(applicationName);

    //Open app sample page
    addComponent.openSamplesPage();
    componentSamplesPage.selectNodeJSSampleAndCreate();

    //Review component page
    componentPage.createApplication();

    //Check application
    applicationDetailPage.createdComponentExists('basic-node-js', applicationName);
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
    applicationDetailPage.createdComponentExists('basic-quarkus', applicationName);
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
