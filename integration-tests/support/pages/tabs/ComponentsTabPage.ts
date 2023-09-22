import { APIHelper } from '../../../utils/APIHelper';
import { Applications } from '../../../utils/Applications';
import { Common } from '../../../utils/Common';
import { componentsTabPO } from '../../pageObjects/pages-po';

export class ComponentsTabPage {
  static clickAddComponent() {
    Common.waitForLoad();
    cy.get(componentsTabPO.addComponent).click();
  }

  static verifyRoute(
    componentName: string,
    // responseBodyContent: string,
    // waitInterval: number = 10000,
    // maxRetryNum: number = 10,
  ) {
    // TODO: Route no longer in components view
    // new ApplicationDetailPage().expandDetails(componentName);
    // cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 })
    //   .invoke('text')
    //   .then((route) => {
    //     APIHelper.checkResponseBodyAndStatusCode(
    //       route,
    //       responseBodyContent,
    //       waitInterval,
    //       0,
    //       maxRetryNum,
    //     );
    //   });
    Applications.checkComponentStatus(componentName, 'Build completed');
  }
}
