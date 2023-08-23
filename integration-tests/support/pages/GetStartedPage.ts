import { Common } from '../../utils/Common';
import { pageTitles } from '../constants/PageTitle';
import { getStartedPagePO } from '../pageObjects/pages-po';

export class GetStartedPage {
  static waitForLoad() {
    Common.verifyPageTitle(pageTitles.getStartedPage);
    cy.get(getStartedPagePO.createAppButton)
      .should('be.visible')
      .and('have.attr', 'aria-disabled', 'false');
  }
}
