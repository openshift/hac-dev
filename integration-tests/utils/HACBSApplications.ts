import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { NavItem } from '../support/constants/PageTitle';
import { overviewTabPO, componentsTabPO, integrationTestsTabPO, pipelinerunsTabPO } from '../support/pageObjects/hacbs-po';
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { AddIntegrationTestPage } from '../support/pages/hacbs/AddIntegrationTestPage';
import { CreateBuildPage } from '../support/pages/hacbs/CreateBuildPage';
import { PipelinerunsTabPage, DetailsTab } from '../support/pages/hacbs/tabs/PipelinerunsTabPage';
import { Applications } from './Applications';
import { Common } from './Common';

export class HACBSApplications {
    static deleteApplication(applicationName: string) {
        Applications.deleteApplication(applicationName);
    }

    static createApplication(name: string) {
        Applications.createApplication(name);
    }

    static createComponent(publicGitRepo: string, componentName: string, triggerPipelinerun: boolean = false) {
        addComponentStep(publicGitRepo);
        reviewComponentsStep(componentName);
        createBuildStep(triggerPipelinerun);
        addIntegrationTestStep();
    }

    static createdComponentExists(componentName: string, applicationName: string) {
        this.goToComponentsTab();

        Common.verifyPageTitle(applicationName);
        Common.waitForLoad();
        this.getComponentListItem(componentName).should('exist');
    }

    static createdPipelinerunsSucceeded(pipelinerunsNames: Array<string>, componentName: string, applicationName: string) {
        for (const pipelinerun of pipelinerunsNames) {
            this.goToPipelinerunsTab();

            // Check if pipelineruns name is visible in list view
            PipelinerunsTabPage.doesPipelinerunExistsInListView(pipelinerun);

            PipelinerunsTabPage.clickOnPipelinerunFromListView(pipelinerun);
            // Assert the 'Status' with string "Succeeded"
            DetailsTab.checkStatusSucceeded();

            Common.navigateTo(NavItem.applications);
            cy.contains(applicationName).click();
        }

        this.goToComponentsTab();
        cy.get(componentsTabPO.componentListItem.replace('{0}', componentName), { timeout: 100000 }).contains(/.*Build Succeeded.*/);
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

    static goToPipelinerunsTab() {
        cy.get(pipelinerunsTabPO.clickTab).click();
    }

    static goToIntegrationTestsTab() {
        cy.get(integrationTestsTabPO.clickTab).click();
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
    cy.contains('div', componentName).should('be.visible');

    //Create Application
    componentPage.createApplication();
}


function createBuildStep(triggerPipelinerun: boolean) {
    const createBuildPage = new CreateBuildPage();

    if (triggerPipelinerun) {
        const outputImageNameSuffix = `${new Date().getTime()}`;

        cy.getCookie('cs_jwt').then(cookie => {
            cy.exec('oc login --server=https://api-toolchain-host-operator.apps.hac-devsandbox.5unc.p1.openshiftapps.com/ --token=' + cookie.value).then((result) => {
                cy.log(result.stderr);
            });
        })

        cy.exec('./trigger-pipelineruns-script.sh ' + outputImageNameSuffix).then((result) => {
            cy.log(result.stderr);
        });

        createBuildPage.confirmSuccessfulPRMerge();
    }

    createBuildPage.clickNext();
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
