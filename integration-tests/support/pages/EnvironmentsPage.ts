import { APIHelper } from '../../utils/APIHelper';
import { hacAPIEndpoints } from '../../utils/APIEndpoints';
import { UIhelper } from '../../utils/UIhelper';
import { environmentsPagePO } from '../pageObjects/pages-po';

export class EnvironmentsPage {
  static createEnvironment(
    envName: string,
    selectCluster: string,
    clusterType: string,
    ingressDomain: string,
    kubeconfig: string,
    targetNamespace: string,
  ) {
    UIhelper.inputValueInTextBoxByLabelName('Environment name', envName);
    UIhelper.selectValueInDropdownbyLabelName('Select cluster', selectCluster);
    UIhelper.selectValueInDropdownbyLabelName('Cluster type', clusterType);
    UIhelper.inputValueInTextBoxByLabelName('Ingress domain', ingressDomain);

    cy.get(environmentsPagePO.kubconfigTextArea).clear().type(kubeconfig, { log: false });
    cy.contains(
      environmentsPagePO.kubeconfigValidationMsg,
      'Contents verified. Everything looks good.',
    ).should('be.visible');

    UIhelper.inputValueInTextBoxByLabelName(
      'Target namespace on the selected cluster',
      targetNamespace,
    );
    this.clickOnCreateEnv();
  }

  static clickOnCreateEnv() {
    UIhelper.clickButton('Create environment');
  }

  static verifyEnvCardDetails(
    envName: string,
    type: string,
    deploymentStrategy: string,
    clusterType: string,
    applicationStatus?: string,
  ) {
    cy.contains(environmentsPagePO.envCard, envName).within(() => {
      cy.get(environmentsPagePO.envCardConnectionLabel)
        .trigger('mouseenter')
        .should('be.visible')
        .and('contain.text', 'Connection successful');
      this.verifyCardLabelAndValue('Type', type);
      this.verifyCardLabelAndValue('Deployment strategy', deploymentStrategy);
      this.verifyCardLabelAndValue('Cluster type', clusterType);
      if (applicationStatus) {
        this.verifyCardLabelAndValue('Application status', applicationStatus, 180000);
      }
    });
  }

  static verifyCardLabelAndValue(label: string, value: string, timeout = 40000) {
    cy.contains(environmentsPagePO.label, label)
      .contains(value, { timeout: timeout })
      .should('be.visible');
  }

  static deleteEnvironment(envName) {
    cy.contains(environmentsPagePO.envCard, envName).find(environmentsPagePO.kebabButton).click();
    cy.get(environmentsPagePO.envDropdownDeleteBtn).should('have.text', 'Delete').click();
    cy.get(environmentsPagePO.envDeleteBtn)
      .should('have.text', 'Delete')
      .and('be.disabled')
      .and('be.visible');
    UIhelper.inputValueInTextBoxByLabelName(`Type "${envName}" to confirm deletion`, envName);
    cy.get(environmentsPagePO.envDeleteBtn)
      .should('be.enabled')
      .and('be.visible')
      .click()
      .should('not.exist');
    cy.contains(environmentsPagePO.envCard, envName).should('not.exist');
  }

  static deleteEnvironmentUsingAPI(envName: string) {
    APIHelper.requestHACAPI({
      method: 'DELETE',
      url: hacAPIEndpoints.environments(envName),
      failOnStatusCode: false,
    });
  }
}
