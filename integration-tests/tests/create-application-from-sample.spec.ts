import { NavItem } from '../support/constants/PageTitle';
import { actions } from '../support/pageObjects/global-po';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentSamplesPage } from '../support/pages/ComponentSamplesPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create component from sample', () => {
  const applicationDetailPage = new ApplicationDetailPage();
  const componentSamplesPage = new ComponentSamplesPage();
  const publicRepos = [
    'https://github.com/nodeshift-starters/devfile-sample.git',
    'https://github.com/devfile-samples/devfile-sample-code-with-quarkus.git',
  ];
  const requestOptions = {
    method: 'GET',
    url: /^.*\/namespaces\/[A-za-z0-9-]+\/components\?limit=250.*$/,
  };

  it('NodeJS component can be created', () => {
    cy.intercept(requestOptions).as('componentsAPI');
    Applications.createApplication();
    componentSamplesPage.selectNodeJSSample();

    cy.wait('@componentsAPI').then((xhr) => {
      cy.url().then((url) => {
        Cypress.env(
          'appName',
          url
            .split('/')
            .filter((e) => e)
            .pop(),
        );
        for (const item of xhr.response.body.items) {
          if (
            item.spec.application === Cypress.env('appName') &&
            item.spec.source.git.url === publicRepos[0]
          ) {
            Applications.goToComponentsTab();
            applicationDetailPage.createdComponentExists(
              item.spec.componentName,
              Cypress.env('appName'),
            );
            break;
          }
        }
      });
    });
  });

  it('Add and then delete a quarkus component', () => {
    //Open components page
    Common.openApplicationURL(Cypress.env('appName'));
    //open app sample page
    applicationDetailPage.openAddComponentPage();
    cy.intercept(requestOptions).as('componentsAPI');
    componentSamplesPage.selectQuarkusSample();
    Applications.goToComponentsTab();

    cy.wait('@componentsAPI', { timeout: 80000 }).then((xhr) => {
      for (const item of xhr.response.body.items) {
        if (
          item.spec.application === Cypress.env('appName') &&
          item.spec.source.git.url === publicRepos[1]
        ) {
          const quarkusComponentName = item.spec.componentName;

          //Check if component exists
          applicationDetailPage.createdComponentExists(
            quarkusComponentName,
            Cypress.env('appName'),
          );

          //Delete component
          applicationDetailPage.deleteComponent(quarkusComponentName);

          //Check if component does not exists
          applicationDetailPage.createdComponentNotExists(quarkusComponentName);
          break;
        }
      }
    });
  });

  it('Delete application with existing component', () => {
    Common.navigateTo(NavItem.applications);
    Applications.openKebabMenu(Cypress.env('appName'));
    cy.get(actions.deleteApp).click();
    cy.get(actions.deleteModalInput).clear().type(Cypress.env('appName'));
    cy.get(actions.deleteModalButton).click();
    cy.get(`[data-id="${Cypress.env('appName')}"]`).should('not.exist');
  });
});
