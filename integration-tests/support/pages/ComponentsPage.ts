import { componentSamplesPagePO, ComponentsPagePO } from '../pageObjects/createApplication-po';
import { alertTitle } from '../pageObjects/global-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class ComponentPage extends AbstractWizardPage {
  saveChanges() {
    cy.get(ComponentsPagePO.saveButton).click();
    this.checkLoading();
  }
  setEnvVar(name: string, value: string) {
    cy.get(ComponentsPagePO.nameInput).type(name);
    cy.get(ComponentsPagePO.valueInput).type(value);
  }
  clickAddEnvVar(){
    cy.get(ComponentsPagePO.addEnvVar).click();
  }
  setReplicas(value: number) {
    cy.get(ComponentsPagePO.replicaInput).clear().type(value.toString());
  }
  setCpuByButton(value: number) {
    cy.get(ComponentsPagePO.cpuInput).then(($cpu) =>{
      let cpu=Number($cpu.val())
      while(cpu != value) {
        if(cpu < value) {
          cy.get(ComponentsPagePO.cpuPlusButton).click();
          cpu++;
        } else {
          cy.get(ComponentsPagePO.cpuMinusButton).click();
          cpu--;
        }
      }
    });

    this.checkCpu(value);
  }
  checkCpu(expectedVal: number) {
    cy.get(ComponentsPagePO.cpuInput).then(($cpu) =>{
      let realCpu=Number($cpu.val());
      expect(expectedVal).equal(realCpu);
    });
  }
  setRam(value: number, unit: string) {
    cy.get(ComponentsPagePO.memoryInput).clear().type(value.toString());
    cy.contains('div[class="pf-c-form__group"]', 'Memory').find(ComponentsPagePO.dropdown).click();
    cy.contains('li', unit).click();
  }
  showAdvancedOptions() {
    cy.contains('button', ComponentsPagePO.showAdvancedSetting).click();
  }
  createApplication() {
    cy.get(ComponentsPagePO.create).click();
    this.checkLoading();
  }

  checkAlert(message: string) {
    cy.contains(alertTitle, message).should('exist');
  }
  checkLoading(){
    cy.get(ComponentsPagePO.loading).should('exist');
    cy.get(ComponentsPagePO.loading).should('not.exist');
  }
}
