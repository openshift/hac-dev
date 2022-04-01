import { basePage } from '../pageObjects/basePage-po';
export class BasePage {
    dismissCookies() {
        cy.get("iframe")
        .its('0.contentDocument')
        .should('exist')
        .its('body')
        .should('not.be.undefined')
        .then(cy.wrap)
        .find(".call")
        .click();
    }
    bannerExists(){
        return cy.get(basePage.devpreview).should("exist")
    }
}
