import { CPUUnit, MemoryUnit } from '../constants/Units';

export class DeploymentSettingsPage {
  static checkCpuAndMemory(
    cpuValue: number,
    cpuUnit: CPUUnit,
    ramValue: number,
    ramUnit: MemoryUnit,
  ) {
    this.checkCpu(cpuValue, cpuUnit);
    this.checkMemory(ramValue, ramUnit);
  }

  static checkInstances(replicaCount: number) {
    this.checkValue('Number of instances', replicaCount);
  }

  static checkCpu(value: number, unit: CPUUnit) {
    this.checkValue('Amount of CPU', value, unit);
  }

  static checkMemory(value: number, unit: MemoryUnit) {
    this.checkValue('Amount of memory', value, unit);
  }

  private static checkValue(label: string, value: number, unit?: string) {
    cy.contains('.pf-v5-c-form__helper-text', label)
      .parent()
      .within(() => {
        cy.get('input[type="number"]').should('have.value', value);
        if (unit) {
          cy.get('[data-test="dropdown-toggle"]').should('contain.text', unit);
        }
      });
  }
}
