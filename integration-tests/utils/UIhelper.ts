
export class UIhelper {

  static clickTab(tabName: string) {
    cy.xpath(`//div[@data-test="app-details__tabs"]//button[child::span[text()='${tabName}']]`).click()
  }

  static inputValueInTextBoxByLabelName(label: string, value: string) {
    cy.xpath(`//div[@class="pf-c-form__group" and descendant::*[text()='${label}']]//input`).clear().type(value)
  }

  static selectValueInDropdownbyLabelName(label: string, value: string) {
    cy.contains('div[class="pf-c-form__group"]', label).within(() => {
      cy.get('div[data-test="dropdown"] > button').click()
      cy.contains('a', value).click().should('not.exist')
    })
  }

  static verifyLabelAndValue(label: string, value: string) {
    cy.contains('div', label).contains('dd', value)
  }

  static clickButton(label: string, options?: { invoke?: boolean, force?: boolean }) {
    if (options?.invoke) {
      cy.xpath(`//*[@data-ouia-component-type="PF4/Button" and text()='${label}']`).invoke("click");
    }
    else if (options?.force) {
      cy.xpath(`//*[@data-ouia-component-type="PF4/Button" and text()='${label}']`).click({ force: true });
    }
    else {
      cy.xpath(`//*[@data-ouia-component-type="PF4/Button" and text()='${label}']`).click();
    }
  }

  static clickLink(link: string, options?: { invoke?: boolean, force?: boolean }) {
    if (options?.invoke) {
      cy.xpath(`//a[text()='${link}']`).invoke("click");
    }
    else if (options?.force) {
      cy.xpath(`//a[text()='${link}']`).click({ force: true });
    }
    else {
      cy.xpath(`//a[text()='${link}']`).click();
    }
  }
}
