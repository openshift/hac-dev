import { Common } from '../../utils/Common';
import { Login } from '../../utils/Login';

before(() => {
  //Clear namespace before running the tests
  Common.cleanNamespace();
  Login.login();
  Common.clickOnConsentButton();
});

after(() => {
  //Clear namespace after running the tests
  Common.cleanNamespace();
});

beforeEach(() => {
  //Preserve cookies between tests
  cy.getCookies().then(cookies => {
    const namesOfCookies = cookies.map(c => c.name)
    Cypress.Cookies.preserveOnce(...namesOfCookies)
  })
});
