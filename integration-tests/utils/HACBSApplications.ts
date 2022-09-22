import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { overviewTabPO, componentsTabPO } from '../support/pageObjects/hacbs-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { AddIntegrationTestPage } from '../support/pages/hacbs/AddIntegrationTestPage';
import { CreateBuildPage } from '../support/pages/hacbs/CreateBuildPage';
import { Applications } from './Applications';
import { Common } from './Common';

export class HACBSApplications {
    static deleteApplication(applicationName: string) {
        Applications.deleteApplication(applicationName);
    }

    static createApplication(name: string) {
        Applications.createApplication(name);
    }

    static createComponent(publicGitRepo: string, componentName: string) {
        addComponentStep(publicGitRepo);
        reviewComponentsStep(componentName);
        createBuildStep();
        addIntegrationTestStep();
    }

    static createdComponentExists(componentName: string, applicationName: string) {
        this.goToComponentsTab();

        Common.verifyPageTitle(applicationName);
        Common.waitForLoad();
        this.getComponentListItem(componentName).should('exist');
    }

    static createdIntegrationTestsExists(name: string, containerImage: string, pipelineName: string) {
        this.goToComponentsTab();

        Common.verifyPageTitle(applicationName);
        Common.waitForLoad();
        this.getComponentListItem(componentName).should('exist');
    }

    static getComponentListItem(application: string) {
        return cy.contains(applicationDetailPagePO.item, application, { timeout: 60000 });
    }

    static goToOverviewTab() {
        cy.get(overviewTabPO.clickTab).click();
    }

    static goToComponentsTab() {
        cy.get(componentsTabPO.clickTab).click();
    }

    static goToIntegrationTestsTab() {
        cy.get(componentsTabPO.clickTab).click();
    }
}

function addComponentStep(publicGitRepo: string) {
    const addComponent = new AddComponentPage();

    // Enter git repo URL
    addComponent.setSource(publicGitRepo);
    // Check if the source is validated
    addComponent.waitRepoValidated();
    // Setup Git Options
    addComponent.clickGitOptions();

    addComponent.clickNext();
}


function reviewComponentsStep(componentName: string) {
    const componentPage = new ComponentPage();

    // Edit component name
    componentPage.editComponentName(componentName + "-temp");
    cy.contains('div', componentName + "-temp").should('be.visible');

    // Switch back to orginal name
    componentPage.editComponentName(componentName);
    cy.contains('div', componentName).should('be.visible');;

    //Create Application
    componentPage.createApplication();
}


function createBuildStep() {
    new CreateBuildPage().clickNext();
}


function addIntegrationTestStep() {
    const addIntegrationTestPage = new AddIntegrationTestPage();
    const displayName = Common.generateAppName('My-name');
    const containerImage = 'quay.io/kpavic/test-bundle:pipeline'
    const pipelineName = 'demo-pipeline'

    addIntegrationTestPage.enterDisplayName(displayName);
    addIntegrationTestPage.enterContainerImage(containerImage);
    addIntegrationTestPage.enterPipelineName(pipelineName);

    addIntegrationTestPage.clickNext();
}
