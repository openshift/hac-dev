import { Login } from '../../utils/Login';

before(() => {
  //Login to Rad Hat SSO
  if (Cypress.env('PR_CHECK') == true) {
    Login.pr_check_login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
  } else {
    Login.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
  }
});
