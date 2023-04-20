import { CPUUnit, MemoryUnit } from '../support/constants/Units';
import { ComponentsPagePO } from '../support/pageObjects/createApplication-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';

describe('Create Component from Public Git Source', { tags: ['@PR-check', '@publicRepo'] }, () => {
  const addComponent = new AddComponentPage();
  const componentPage = new ComponentPage();
  const applicationDetailPage = new ApplicationDetailPage();
  const applicationName = Common.generateAppName();
  const publicRepo = 'https://github.com/hac-test/multi-components-repo';
  const gitReference = 'v1.0';
  const contextDir = 'nodejs-app';
  const ramValue = 1;
  const ramUnit = MemoryUnit.gigabyte;
  const replicaCount = 2;
  const cpuCount = 10;
  const cpuUnit = CPUUnit.millicore;

  after(() => {
    Applications.deleteApplication(applicationName);
  });

  describe('Creating a Quarkus Component', () => {
    it('Create Application', () => {
      Applications.createApplication(applicationName);
    });
    it('Validate Repo', () => {
      // Enter git repo URL
      addComponent.setSource(publicRepo);
      // Check if the source is validated
      addComponent.waitRepoValidated();
    });

    it('Setup Git Options', () => {
      addComponent.clickGitOptions();

      addComponent.setGitReference(gitReference);
      addComponent.setContextDir(contextDir);
      UIhelper.clickButton('Next', { invoke: true });
    });

    it('Update Build & deploy configuration', () => {
      Common.waitForLoad();
      cy.get(ComponentsPagePO.extractComponentName).then((innerText) => {
        componentPage.componentName = innerText.text().trim();

        componentPage.expandDetails(componentPage.componentName);
        componentPage.setCpuByButton(cpuCount + 1, cpuUnit);
        componentPage.setRam(ramValue, ramUnit);
      });
    });

    it('Update replicas in advanced deployment options and set Env var', () => {
      componentPage.showAdvancedOptions();
      componentPage.setReplicas(replicaCount);
      componentPage.addEnvVar('secondEnvVar', '3000');
    });

    it('Click Create Application and validate Components', () => {
      componentPage.createApplication();
      Applications.goToComponentsTab();
      applicationDetailPage.createdComponentExists(componentPage.componentName, applicationName);
      componentPage.verifyComponentGHReferenceAndLink(
        `hac-test/multi-components-repo (${gitReference} / ${contextDir})`,
        `${publicRepo}/tree/${gitReference}/${contextDir}`,
      );
    });

    it('Check python component should not exists', () => {
      cy.contains('python-app-multi-components').should('not.exist');
    });
  });

  describe('Change resources for the existing app', () => {
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
    });

    it('Check updated resources values', () => {
      Applications.goToComponentsTab();
      applicationDetailPage.expandDetails(componentPage.componentName);
      applicationDetailPage.checkCpuAndMemory(cpuCount, CPUUnit.millicore, 2, MemoryUnit.gigabyte);
    });
  });
});
