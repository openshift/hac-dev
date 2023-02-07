import { CPUUnit, MemoryUnit } from '../support/constants/Units';
import { ComponentsPagePO } from '../support/pageObjects/createApplication-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Component from Public Git Source', { tags: ['@PR-check', '@publicRepo'] }, () => {
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
      Common.waitForLoad();
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
      Applications.goToComponentsTab();
      applicationDetailPage.createdComponentExists(componentPage.componentName, applicationName);
    });

    it('Check Component Build Log', () => {
      applicationDetailPage.openBuildLog(componentPage.componentName);

      // Workaround for https://issues.redhat.com/browse/HAC-3071
      cy.get('li[class*="pipeline-run-logs__navitem"]', {timeout: 40000}).should("include.text", "clone-repository");

      applicationDetailPage.checkBuildLog("appstudio-init", 'Determine if Image Already Exists');
      applicationDetailPage.closeBuildLog();
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
      Applications.goToComponentsTab();
      applicationDetailPage.expandDetails(componentPage.componentName);
      applicationDetailPage.checkCpuAndMemory(cpuCount, CPUUnit.millicore, 2, MemoryUnit.gigabyte);
    });
  });
});
