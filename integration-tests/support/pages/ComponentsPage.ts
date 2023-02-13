import { Common } from '../../utils/Common';
import { CPUUnit, MemoryUnit } from '../constants/Units';
import { addComponentPagePO, ComponentsPagePO } from '../pageObjects/createApplication-po';
import { alertTitle } from '../pageObjects/global-po';
import { AbstractWizardPage } from './AbstractWizardPage';

export class ComponentPage extends AbstractWizardPage {
  public componentName: string;

  editComponentName(newName: string) {
    cy.get(ComponentsPagePO.editComponentNameIcon, { timeout: 80000 }).eq(0).click();
    cy.get(ComponentsPagePO.editNameInput).clear().type(newName);
    cy.get(ComponentsPagePO.checkIcon).click();
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

  createApplication() {
    cy.get(ComponentsPagePO.create).click({ force: true });
    cy.get(ComponentsPagePO.create).should('be.disabled');
    Common.waitForLoad();
  }

  checkAlert(message: string) {
    cy.contains(alertTitle, message).should('exist');
  }

  expandDetails(componentName: string) {
    cy.get(addComponentPagePO.toggleButton.replace('{0}', componentName)).click();
  }
}
