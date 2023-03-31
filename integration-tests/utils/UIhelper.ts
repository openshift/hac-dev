import { UIhelperPO } from "../support/pageObjects/global-po";

export class UIhelper {
  static clickTab(tabName: string) {
    return cy
      .xpath(
        `//div[@data-ouia-component-type="PF4/Tabs"]//button[child::span[text()='${tabName}']]`,
      )
      .click();
  }

  static inputValueInTextBoxByLabelName(label: string, value: string) {
    return cy
      .xpath(`//div[@class="pf-c-form__group" and descendant::*[text()='${label}']]//input`)
      .clear()
      .type(value);
  }

  static selectValueInDropdownbyLabelName(label: string, value: string) {
    cy.contains('div[class="pf-c-form__group"]', label).within(() => {
      cy.get('div[data-test="dropdown"] > button').click();
      cy.contains('a', value).click().should('not.exist');
    });
  }

  static verifyLabelAndValue(label: string, value: string) {
    cy.log(`Validate Label : "${label}" should have value : "${value}"`);
    return cy
      .xpath(
        `//div[contains(@class,"list__group") and descendant::dt//*[text()="${label}"]]/dd//*[text()="${value}"]`,
      )
      .scrollIntoView()
      .should('be.visible');
  }

  static clickButton(label: string, options?: { invoke?: boolean; force?: boolean }) {
    if (options?.invoke) {
      return cy
        .xpath(`//*[@data-ouia-component-type="PF4/Button" and text()='${label}']`)
        .invoke('click');
    } else if (options?.force) {
      return cy
        .xpath(`//*[@data-ouia-component-type="PF4/Button" and text()='${label}']`)
        .click({ force: true });
    }

    return cy.xpath(`//*[@data-ouia-component-type="PF4/Button" and text()='${label}']`).click();
  }

  static clickLink(link: string, options?: { invoke?: boolean; force?: boolean }) {
    if (options?.invoke) {
      return cy.xpath(`//a[text()='${link}']`).invoke('click');
    } else if (options?.force) {
      return cy.xpath(`//a[text()='${link}']`).click({ force: true });
    }

    return cy.xpath(`//a[text()='${link}']`).click();
  }

  static getTableRow(tableAriaLabel: string, uniqueRowText: string | RegExp) {
    return cy.contains(`div[aria-label="${tableAriaLabel}"] tr[role="row"]`, uniqueRowText, { timeout: 60000 })
  }

  static verifyRowInTable(tableAriaLabel: string, uniqueRowText: string | RegExp, rowValues: string[] | RegExp[]) {
    UIhelper.getTableRow(tableAriaLabel, uniqueRowText).within(() => {
      rowValues.forEach((val) => {
        cy.contains(val).should('be.visible')
      })
    })
  }

  static clickRowCellInTable(tableAriaLabel: string, uniqueRowText: string | RegExp, cellTextToClick: string | RegExp) {
    UIhelper.getTableRow(tableAriaLabel, uniqueRowText).contains(cellTextToClick).click()
  }

  static verifyGraphNodes(nodeText: string, success = true) {
    cy.contains(UIhelperPO.graphNode, nodeText).within(() => {
      cy.get(
        success
          ? UIhelperPO.pipelineStatusSuccess
          : UIhelperPO.pipelineNode,
        { timeout: 60000 },
      )
        .scrollIntoView()
        .should('be.visible');
    });
  }
  
}
