import { Common } from '../../utils/Common';
import { Login } from '../../utils/Login';

before(() => {
  //Clear namespace before running the tests
  Common.cleanNamespace();
  Cypress.Cookies.debug(true);
  
  const url = new URL(Cypress.env('HAC_BASE_URL'));
  cy.setCookie('notice_gdpr_prefs', '0,1,2:', { domain: url.hostname });
  cy.setCookie('cmapi_cookie_privacy', 'permit 1,2,3', { domain: url.hostname });
  cy.setCookie('notice_preferences', '2:', { domain: url.hostname });

  if (Cypress.env('PR_CHECK') === true) {
    Login.prCheckLogin();
  } else {
    Login.login();
  }
});

after(() => {
  //Clear namespace after running the tests
  Common.cleanNamespace();
});

beforeEach(() => {
  //Preserve cookies between tests
  cy.getCookies().then((cookies) => {
    const namesOfCookies = cookies.map((c) => c.name);
    Cypress.Cookies.preserveOnce(...namesOfCookies);
  });
  Cypress.Cookies.debug(true);
});
