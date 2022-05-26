// Include the cypress customized commands related files
import './hooks';

//Handling errors from application
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
Cypress.on('uncaught:exception', (err) => {
  return false;
});

// Add browser logs collector
const logOptions = {
  enableExtendedCollector: true
};
require('cypress-terminal-report/src/installLogsCollector')(logOptions);
