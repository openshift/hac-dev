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
  const publicRepo = 'https://github.com/hac-test/multi-components-repo';
  const gitReference = 'v1.0';
  const contextDir = 'nodejs-app';
  const ramValue = 1;
  const ramUnit = MemoryUnit.gigabyte;
  const replicaCount = 2;
  const cpuCount = 8;
  const cpuUnit = CPUUnit.millicore;

  after(() => {
    Applications.deleteApplication(applicationName);
  });

  describe('Creating a Quarkus Component', () => {
    it('Import code', () => {
      Applications.createApplication();
      addComponent.setSource(publicRepo);
      addComponent.waitRepoValidated();
      addComponent.setGitReference(gitReference);
      addComponent.setContextDir(contextDir);
      addComponent.submit();
      Common.waitForLoad();
    });

    it('Update Build & deploy configuration', () => {
      componentPage.setApplicationName(applicationName);
      componentPage.extractComponentName();
      componentPage.setCpuByButton(cpuCount + 1, cpuUnit);
      componentPage.setRam(ramValue, ramUnit);
    });

    it('Update replicas in and set Env var', () => {
      componentPage.setReplicas(replicaCount);
      componentPage.addEnvVar('secondEnvVar', '3000');
    });

    it('Click Create Application and validate Components', () => {
      componentPage.clickCreateApplication();
      Applications.goToComponentsTab();
      applicationDetailPage.createdComponentExists(componentPage.componentName, applicationName);
      componentPage.verifyComponentGHReferenceAndLink(
        `hac-test/multi-components-repo (${gitReference} / ${contextDir})`,
        `${publicRepo}/tree/${gitReference}/${contextDir}`,
      );
    });

    it('Check python component does not exist', () => {
      cy.contains('python-app-multi-components').should('not.exist');
    });
  });

  describe('Change resources for the existing app', () => {
    it('Check Resources Value', () => {
      applicationDetailPage.expandDetails(componentPage.componentName);
      applicationDetailPage.checkCpuAndMemory(cpuCount + 1, cpuUnit, ramValue, ramUnit);
      applicationDetailPage.checkReplica(replicaCount);
    });

    // Skipping due to : https://issues.redhat.com/browse/HAC-3184
    // it('Change Resources Value', () => {
    //   applicationDetailPage.openComponentSettings(componentPage.componentName);
    //   componentPage.setRam(2, MemoryUnit.gigabyte);
    //   componentPage.setCpuByButton(cpuCount, cpuUnit);
    //   componentPage.saveChanges();
    // });

    // it('Check updated resources values', () => {
    //   Applications.goToComponentsTab();
    //   applicationDetailPage.expandDetails(componentPage.componentName);
    //   applicationDetailPage.checkCpuAndMemory(cpuCount, CPUUnit.millicore, 2, MemoryUnit.gigabyte);
    // });
  });
});
