import { Login } from '../../utils/Login';

before(() => {
  //Login to Rad Hat SSO
  Login.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
});
