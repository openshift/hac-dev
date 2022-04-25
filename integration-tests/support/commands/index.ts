// Include the cypress customized commands related files
import './hooks';

  //Handling errors from application
  Cypress.on('uncaught:exception', (err) => {
    return false;
  })