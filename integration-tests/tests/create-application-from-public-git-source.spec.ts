import { CPUUnit, MemoryUnit } from '../support/constants/Units';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Component from Public Git Source', () => {
  const addComponent = new AddComponentPage();
  const componentPage = new ComponentPage();
  const applicationDetailPage = new ApplicationDetailPage();
  const applicationName = Common.generateAppName();
  const publicRepo = 'https://github.com/dheerajodha/devfile-sample-code-with-quarkus';
  const ramValue = 1;
  const ramUnit = MemoryUnit.gigabyte;
  const replicaCount = 2;
  const cpuCount = 10;
  const cpuUnit = CPUUnit.millicore;

  before(() => {
    // Disable HACBS
    localStorage.setItem('hacbs', 'false');
    // Need to reload the page after enabling HACBS via localStorage
    cy.reload();
    //set application name
    Applications.createApplication(applicationName);
  });

  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: /^.*\/namespaces\/[A-za-z0-9-]+\/componentdetectionqueries\/[A-za-z0-9-]+/,
      }
    ).as('getCDQ');
  });

  after(() => {
    //Open components page
    Common.openApplicationURL(applicationName);
    Applications.deleteApplication(applicationName);
  });

  describe('Creating a Quarkus Component', () => {
    it('Validate Repo', () => {
      // Enter git repo URL
      addComponent.setSource(publicRepo);
      // Check if the source is validated
      addComponent.waitRepoValidated();
    });

    it('Setup Git Options', () => {
      Common.waitForLoad();
      addComponent.clickGitOptions();

      //Next block commented out because of bug:
      //https://issues.redhat.com/browse/HAC-1285

      //addComponent.setGitReference(gitReference);
      //addComponent.setContextDir(contextDir);
      addComponent.clickNext();
    });

    it('Check Changing Resources', () => {
      // Waiting to make sure CDQ call gets processed successfully first
      cy.wait(45000);

      cy.wait('@getCDQ').then((xhr) => {
        assert.isNotNull(xhr.response.body.status.componentDetected, 'Make sure the component is detected');
      });

      cy.wait('@getCDQ').then((xhr) => {
        const componentName = Object.keys(xhr.response.body.status.componentDetected)[0];

        componentPage.editComponentName(componentName);
        cy.contains('div', componentName).should('be.visible');
  
        componentPage.expandDetails(componentName);
        componentPage.setCpuByButton(cpuCount + 1, cpuUnit);
        componentPage.setRam(ramValue, ramUnit);
      });
    });

    it('Check Changing Replicas', () => {
      componentPage.showAdvancedOptions();
      componentPage.setReplicas(replicaCount);
    });

    // it.skip('Check Route settings', () => {
    // Currently not working, waiting for fix.
    // https://coreos.slack.com/archives/C02GG6FUXCH/p1652432446123619
    // });

    it('Add Environment Variable', () => {
      componentPage.addEnvVar('secondEnvVar', '3000');
    });

    it('Create Application and verify logs and resource values', () => {
      cy.intercept(
        {
          method: 'GET',
          url: /^.*\/namespaces\/[A-za-z0-9-]+\/components\?limit=250.*$/,
        }
      ).as('componentsAPI');

      componentPage.createApplication();

      cy.wait('@componentsAPI').then((xhr) => {
        for (let item of xhr.response.body.items) {
          if (item.spec.application == applicationName) {
            var componentName = item.spec.componentName;
            cy.log(componentName);
            applicationDetailPage.createdComponentExists(componentName, applicationName);

            /* Check Component Build Log */
            // TODO: implement check for build log appropriate text
            applicationDetailPage.checkBuildLog(componentName, 'text to verify');

            /* Check Resources Value */
            applicationDetailPage.expandDetails(componentName);
            applicationDetailPage.checkCpuAndMemory(cpuCount + 1, cpuUnit, ramValue, ramUnit);
            applicationDetailPage.checkReplica(replicaCount);

            /* Change Resources Value */
            applicationDetailPage.openComponentSettings(componentName);
            componentPage.setRam(2, MemoryUnit.gigabyte);
            componentPage.setCpuByButton(cpuCount, cpuUnit);
            componentPage.saveChanges();
            applicationDetailPage.expandDetails(componentName);
            applicationDetailPage.checkCpuAndMemory(cpuCount, CPUUnit.millicore, 2, MemoryUnit.gigabyte);

            break;
          }
        }
      });
    });
  });
});
