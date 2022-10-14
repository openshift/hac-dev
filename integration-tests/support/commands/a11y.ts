import 'cypress-axe';
import { Result } from 'axe-core';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      logA11yViolations(violations: Result[], target: string): Chainable<Element>;
      testA11y(target: string, selector?: string): Chainable<Element>;
    }
  }
}

export const a11yTestResults: a11yTestResultsType = {
  numberViolations: 0,
  numberChecks: 0,
};

const logA11yViolations = (violations: Result[], target: string) => {
  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length,
  }));
  a11yTestResults.numberViolations += violations.length;
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${
      violations.length === 1 ? 'was' : 'were'
    } detected ${target ? `for ${target}` : ''}`,
  );
  cy.task('logTable', violationData);
};

// TODO: Enable errors on failure once HAC-1991 is done
Cypress.Commands.add('testA11y', (target: string, selector?: string) => {
  cy.injectAxe();
  cy.configureAxe();
  a11yTestResults.numberChecks += 1;
  cy.checkA11y(
    selector,
    {
      includedImpacts: ['serious', 'critical'],
    },
    (violations) => logA11yViolations(violations, target),
    true,
  );
});

type a11yTestResultsType = {
  numberViolations: number;
  numberChecks: number;
};
