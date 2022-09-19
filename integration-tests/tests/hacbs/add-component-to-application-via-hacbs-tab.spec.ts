import { Applications } from "../../utils/Applications";
import { Common } from "../../utils/Common";
import { ComponentsTabPage } from "../../support/pages/hacbs/ComponentsTabPage";
import { actionsDropdown } from "../../support/pageObjects/hacbs-po";
import { HACBSApplications } from "../../utils/HACBSApplications";
import { OverviewTabPage } from "../../support/pages/hacbs/OverviewTabPage";

describe('Create Components using the HACBS UI', () => {
    const LOCAL_STORAGE_KEY_GS_MODAL = 'hacbs/getting-started-modal';
    const LOCAL_STORAGE_KEY_QUICKSTART = 'hacbs/showApplicationQuickstart';
    const applicationName = Common.generateAppName();
    const overviewTabPage = new OverviewTabPage();
    const componentsTabPage = new ComponentsTabPage();
    const publicRepos = [
            'https://github.com/dheerajodha/devfile-sample-code-with-quarkus',
            'https://github.com/devfile-samples/devfile-sample-go-basic.git',
            'https://github.com/nodeshift-starters/devfile-sample.git'
            ]
    const componentNames = ['java-quarkus', 'go', 'go-component', 'nodejs'];

    before(function () {
        // Enable HACBS
        localStorage.setItem('hacbs', 'true');
        localStorage.setItem(LOCAL_STORAGE_KEY_GS_MODAL, 'true');
        // Need to reload the page after enabling HACBS via localStorage
        cy.reload();
    });

    beforeEach(function () {
        localStorage.setItem(LOCAL_STORAGE_KEY_GS_MODAL, 'true');
        localStorage.setItem(LOCAL_STORAGE_KEY_QUICKSTART, 'true');
    });

    after(function () {
        //Delete the application
        Applications.deleteApplication(applicationName);
    });

    describe('Create an Application with a component', () => {
        it('Set Application Name', () => {
            Applications.createApplication(applicationName);
        })

        it('Add a component to Application', () => {
            HACBSApplications.createComponent(publicRepos[0], componentNames[0]);
            HACBSApplications.createdComponentExists(componentNames[0], applicationName);
        });
    });

    describe('Add a new component using the "Overview" tab', () => {
        it("Use HACBS 'Components' tabs to start adding a new compoent", () => {
            HACBSApplications.goToOverviewTab();
            overviewTabPage.addComponent();
        });

        it('Add a component to Application', () => {
            HACBSApplications.createComponent(publicRepos[1], componentNames[1]);
            HACBSApplications.createdComponentExists(componentNames[1], applicationName);
        });
    });

    describe('Add a new component using the "Components" tab', () => {
        it("Use HACBS 'Components' tabs to start adding a new compoent", () => {
            HACBSApplications.goToComponentsTab();
            componentsTabPage.clickAddComponent();
        });

        it('Add a component to Application', () => {
            HACBSApplications.createComponent(publicRepos[1], componentNames[2]);
            HACBSApplications.createdComponentExists(componentNames[2], applicationName);
        });
    });

    describe('Add a new component using the "Actions" dropdown', () => {
        it("Click 'Actions' dropdown to add a component", () => {
            cy.get(actionsDropdown.dropdown).click();
            cy.contains('Add Component').click();
        });

        it('Add a component to Application', () => {
            HACBSApplications.createComponent(publicRepos[2], componentNames[3]);
            HACBSApplications.createdComponentExists(componentNames[3], applicationName);
        });
    });
});
