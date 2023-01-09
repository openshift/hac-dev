import { CPUUnit, MemoryUnit } from '../support/constants/Units';
import { ComponentsPagePO } from '../support/pageObjects/createApplication-po';
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
      cy.get(ComponentsPagePO.extractComponentName).then((innerText) => {
        componentPage.componentName = innerText.text().trim();

        componentPage.expandDetails(componentPage.componentName);
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

    it('Create Application', () => {
      componentPage.createApplication();
      applicationDetailPage.createdComponentExists(componentPage.componentName, applicationName);
    });

    it('Check Component Build Log', () => {
      // TODO: implement check for build log appropriate text
      applicationDetailPage.checkBuildLog(componentPage.componentName, 'text to verify');
    });

    it('Check Resources Value', () => {
      applicationDetailPage.expandDetails(componentPage.componentName);
      applicationDetailPage.checkCpuAndMemory(cpuCount + 1, cpuUnit, ramValue, ramUnit);
      applicationDetailPage.checkReplica(replicaCount);
    });

    it('Change Resources Value', () => {
      applicationDetailPage.openComponentSettings(componentPage.componentName);
      componentPage.setRam(2, MemoryUnit.gigabyte);
      componentPage.setCpuByButton(cpuCount, cpuUnit);
      componentPage.saveChanges();
      applicationDetailPage.expandDetails(componentPage.componentName);
      applicationDetailPage.checkCpuAndMemory(cpuCount, CPUUnit.millicore, 2, MemoryUnit.gigabyte);
    });
  });
});
