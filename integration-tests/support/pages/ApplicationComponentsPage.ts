import { applicationComponentsPagePO } from '../pageObjects/createApplication-po';
import { alertTitle } from '../pageObjects/global-po';
import { AbstractWizardPage } from './AbstractWizardPage';
export class ApplicationComponentPage extends AbstractWizardPage {
  createApplication() {
    cy.get(applicationComponentsPagePO.create).click();
    cy.contains(applicationComponentsPagePO.createText).click();
    cy.get('body').find(applicationComponentsPagePO.create).its('length').then(res=>{
      if(res > 0){
        cy.contains(applicationComponentsPagePO.createText).click();
      }
    });
  }

  checkAlert(message: string) {
    cy.get(alertTitle).contains(message).should('exist');
  }

  createdApplicationExists(application: string) {
    cy.contains(application).should('exist');
  }

  createdApplicationNotExists(application: string) {
    cy.contains(application).should('not.exist');
  }

  deleteComponent(componentName: string) {
    cy.get('[aria-label="' + componentName + '"]').find(applicationComponentsPagePO.componentPreferences).click();
    cy.get(applicationComponentsPagePO.componentDelete).click();
  }
}
