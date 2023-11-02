import { NavItem } from '../support/constants/PageTitle';
import { EnvironmentsPage } from '../support/pages/EnvironmentsPage';
import { DetailsTab } from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';

describe('Create Env using Non-OpenShift Cluster', () => {
  const applicationName = Common.generateAppName();
  const publicRepo = 'https://github.com/devfile-samples/devfile-sample-python-basic.git';
  const componentName: string = Common.generateAppName('python-basic');

  const envName = Common.generateAppName('env');
  const clusterInformation = {
    cluster: 'I want to bring my own cluster',
    type: 'Non-OpenShift',
    ingressDomain: 'apps.hac-devsandbox.5unc.p1.openshiftapps.com',
    kubeconfig: Buffer.from(Cypress.env('VC_KUBECONFIG'), 'base64').toString('utf8'),
    targetNamespace: 'default',
  };

  after(function () {
    Applications.deleteApplication(applicationName);
    EnvironmentsPage.deleteEnvironmentUsingAPI(envName);
  });

  describe('Create a environment', () => {
    it('Create environment', () => {
      Common.navigateTo(NavItem.environments);
      EnvironmentsPage.clickOnCreateEnv();
      EnvironmentsPage.createEnvironment(
        envName,
        clusterInformation.cluster,
        clusterInformation.type,
        clusterInformation.ingressDomain,
        clusterInformation.kubeconfig,
        clusterInformation.targetNamespace,
      );
    });

    it('Verify new Env on Environments Tab', () => {
      EnvironmentsPage.verifyEnvCardDetails(envName, 'Self Managed', 'Automatic', 'Kubernetes');
    });
  });

  describe('Create an Application', () => {
    it('Create an Application with a component', () => {
      Common.navigateTo(NavItem.applications);
      Applications.createApplication();
      Applications.createComponent(publicRepo, componentName, applicationName);
    });

    it('Verify the Build Pipeline run details', () => {
      Applications.goToPipelinerunsTab();
      UIhelper.getTableRow('Pipeline run List', /Running|Pending/)
        .contains(`${componentName}-`)
        .invoke('text')
        .then((pipelinerunName) => {
          UIhelper.clickLink(pipelinerunName);
          DetailsTab.waitForPLRAndDownloadAllLogs();
        });
    });

    it('Verify Enterprise contract Test pipeline run Details', () => {
      Applications.clickBreadcrumbLink('Pipeline runs');
      UIhelper.clickRowCellInTable('Pipeline run List', 'Test', `${applicationName}-`);
      DetailsTab.waitForPLRAndDownloadAllLogs(false);
    });
  });

  describe('Verify application in deployments Tab and delete application and env', () => {
    it('verify application status in Deployments Tab', () => {
      Applications.clickBreadcrumbLink(applicationName);
      UIhelper.clickTab('Deployments');
      EnvironmentsPage.verifyEnvCardDetails(
        envName,
        'Self Managed',
        'Automatic',
        'Kubernetes',
        'Healthy',
      );
    });

    it('Delete Application', () => {
      Applications.deleteApplication(applicationName);
    });

    it('Delete Environment', () => {
      Common.navigateTo(NavItem.environments);
      EnvironmentsPage.deleteEnvironment(envName);
    });
  });
});
