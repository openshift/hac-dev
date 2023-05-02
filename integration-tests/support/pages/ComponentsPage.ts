import { Common } from '../../utils/Common';
import { UIhelper } from '../../utils/UIhelper';
import { CPUUnit, MemoryUnit } from '../constants/Units';
import { addComponentPagePO, ComponentsPagePO } from '../pageObjects/createApplication-po';
import { alertTitle } from '../pageObjects/global-po';
import { componentsTabPO } from '../pageObjects/pages-po';
import { AbstractWizardPage } from './AbstractWizardPage';

export class ComponentPage extends AbstractWizardPage {
  public componentName: string;

  editComponentName(newName: string) {
    cy.get(ComponentsPagePO.dropdown, { timeout: 80000 }).eq(0).should('be.enabled'); // Work around for issue : HAC-3585 to reduce test flakiness
    cy.get(ComponentsPagePO.editComponentNameIcon, { timeout: 80000 }).eq(0).click();
    cy.get(ComponentsPagePO.editNameInput).clear().type(newName);
    cy.get(ComponentsPagePO.checkIcon).click();
    cy.contains('div', newName).should('be.visible');
  }

  saveChanges() {
    cy.get(ComponentsPagePO.saveButton).click();
    Common.waitForLoad();
  }

  addEnvVar(name: string, value: string) {
    cy.get('body').then((body) => {
      if (body.find(ComponentsPagePO.nameInput).length === 0) {
        this.clickAddEnvVar();
      }
      this.setEnvVar(name, value);
    });
  }

  setEnvVar(name: string, value: string) {
    cy.get(ComponentsPagePO.nameInput).type(name);
    cy.get(ComponentsPagePO.valueInput).type(value);
  }

  clickAddEnvVar() {
    cy.get(ComponentsPagePO.addEnvVar).click();
  }

  setReplicas(value: number) {
    cy.get(ComponentsPagePO.replicaInput).clear().type(value.toString());
  }

  setCpuByButton(value: number, unit: CPUUnit) {
    cy.contains(`.pf-c-dropdown__toggle-text`, 'cores').parent().click();
    cy.contains('li', new RegExp(`^${unit}$`)).click();

    cy.get(ComponentsPagePO.cpuInput).then(($cpu) => {
      const diff = value - Number($cpu.val());
      if (diff === 0) {
        return;
      }
      const button = diff > 0 ? ComponentsPagePO.cpuPlusButton : ComponentsPagePO.cpuMinusButton;

      for (let i = 0; i < Math.abs(diff); i++) {
        cy.get(button).click();
      }
    });

    this.checkCpu(value);
  }

  checkCpu(expectedVal: number) {
    cy.get(ComponentsPagePO.cpuInput).then(($cpu) => {
      const realCpu = Number($cpu.val());
      expect(expectedVal).equal(realCpu);
    });
  }

  setRam(value: number, unit: MemoryUnit) {
    cy.get(ComponentsPagePO.memoryInput).clear().type(value.toString());
    cy.contains('div[class="pf-c-form__group"]', 'Memory').find(ComponentsPagePO.dropdown).click();
    cy.contains('li', unit).click();
  }

  showAdvancedOptions() {
    cy.contains('button', ComponentsPagePO.showAdvancedSetting).click();
    cy.testA11y(`Component deployment options`);
  }

  selectRuntime(runtimeName: string) {
    UIhelper.selectValueInDropdownbyLabelName('Runtime', runtimeName);
  }

  clickCreateApplication() {
    cy.get(ComponentsPagePO.create).invoke('click').should('be.disabled');
    Common.waitForLoad();
  }

  checkAlert(message: string) {
    cy.contains(alertTitle, message).should('exist');
  }

  expandDetails(componentName: string) {
    cy.contains(addComponentPagePO.componentCard, componentName)
      .find(addComponentPagePO.toggleButton)
      .click();
  }

  selectCustomBuildPipeline() {
    cy.get(ComponentsPagePO.customBuildPipelineRadioBtn).click();
  }

  checkStatusOnModal(labelText: string) {
    cy.contains(ComponentsPagePO.label, labelText, { timeout: 150000 }).should('be.visible');
  }

  verifyAndWaitForPRIsSent() {
    this.checkStatusOnModal('Merge pull request');
    cy.contains('a', 'Merge in GitHub').should('be.visible');
  }

  verifyAndWaitForPRMerge() {
    this.checkStatusOnModal('Custom');
    cy.contains('a', 'Edit pipeline in GitHub').should('be.visible');
  }

  closeModal() {
    cy.get(ComponentsPagePO.customBuildPipelineModalCloseBtn).click();
  }

  verifyComponentGHReferenceAndLink(linkText: string, link: string) {
    cy.contains('a', linkText).should('be.visible').and('have.attr', 'href', link);
  }

  verifyRuntime(runtimeType: string) {
    cy.get(ComponentsPagePO.dropdown, { timeout: 80000 }).eq(0).should('have.text', runtimeType);
  }
}
