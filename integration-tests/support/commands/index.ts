// Include the cypress customized commands related files
import './hooks';
import './a11y';
import './perf';
import { Result } from 'axe-core';
import { initPerfMeasuring } from './perf';
const registerCypressGrep = require('cypress-grep')
const addContext = require('mochawesome/addContext');
registerCypressGrep()

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      logA11yViolations(violations: Result[], target: string): Chainable<Element>;
      testA11y(target: string, selector?: string): Chainable<Element>;
      perfGroupStart(groupName: string): void
      perfGroupEnd(groupName: string): void
    }
  }
}

//Handling errors from application
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
Cypress.on('uncaught:exception', (err) => {
  return false;
});

// Add browser logs collector
const logOptions = {
  enableExtendedCollector: true,
};
require('cypress-terminal-report/src/installLogsCollector')(logOptions);
require('@cypress/xpath');
initPerfMeasuring('cypress/perfstats.json');

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    let screenshot = `../../screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
    if (runnable.parent.parent.title){
      screenshot = `../../screenshots/${Cypress.spec.name}/${runnable.parent.parent.title} -- ${runnable.parent.title} -- ${test.title} (failed).png`;
    }
    addContext({ test }, screenshot);
  }
});
