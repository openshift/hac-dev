import { Common } from '../../utils/Common';
import { pageTitles } from '../constants/PageTitle';
import { createApplicationPagePO } from '../pageObjects/createApplication-po';
import { AbstractWizardPage } from './AbstractWizardPage';

export class CreateApplicationPage extends AbstractWizardPage {
  getApplicationName() {
    return cy.get(createApplicationPagePO.applicationName);
  }

  setApplicationName(name: string) {
    this.clearApplicationName();
    cy.get(createApplicationPagePO.applicationName).type(name);
  }

  clearApplicationName() {
    cy.get(createApplicationPagePO.applicationName).clear();
  }

  clickCreateApplication() {
    cy.get('body').then((body) => {
      if (body.find("h4:contains('No applications')").length > 0) {
        cy.get('.pf-c-empty-state__content')
          .contains(createApplicationPagePO.createApplication)
          .click({ force: true });
      } else {
        cy.contains(createApplicationPagePO.createApplication).click({ force: true });
      }
      Common.verifyPageTitle(pageTitles.createApp);
      Common.waitForLoad();
    });
  }

  clickNext() {
    cy.get(createApplicationPagePO.next).click({ force: true });
  }
}
