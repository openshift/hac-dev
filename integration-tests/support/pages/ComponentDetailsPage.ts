import { APIHelper } from '../../utils/APIHelper';
import { UIhelper } from '../../utils/UIhelper';
import { buildLogModalContentPO } from '../pageObjects/createApplication-po';
import { componentDetailsPO } from '../pageObjects/pages-po';

export class ComponentDetailsPage {
  static openTab(tab: ComponentPageTabs) {
    UIhelper.clickTab(tab);
  }

  static checkBuildImage() {
    cy.get(componentDetailsPO.buildImage)
      .invoke('val')
      .then((value) => {
        cy.exec(`skopeo inspect -f "Name: {{.Name}} Digest: {{.Digest}}" docker://${value}`, {
          timeout: 300000,
        })
          .its('code')
          .should('eq', 0);
      });
  }

  static editComponent() {
    cy.contains('button', 'Edit deployment settings').click();
  }

  static checkSBOM() {
    cy.contains('.pf-v5-c-description-list__group', 'SBOM')
      .find('input')
      .should('contain.value', `cosign download sbom quay.io/`)
      .and('be.visible');
  }

  static openPodLogs() {
    cy.contains('button', 'View pod logs').click();
    cy.get(buildLogModalContentPO.modal).should('exist');
  }
}

export class DeploymentsTab {
  static verifyRoute(
    responseBodyContent: string,
    waitInterval: number = 10000,
    maxRetryNum: number = 10,
  ) {
    cy.get(componentDetailsPO.route)
      .invoke('attr', 'href')
      .then((route) => {
        APIHelper.checkResponseBodyAndStatusCode(
          route,
          responseBodyContent,
          waitInterval,
          0,
          maxRetryNum,
        );
      });
  }
}

export enum ComponentPageTabs {
  detail = 'Component details',
  activity = 'Activity',
  deployments = 'Deployments',
}
