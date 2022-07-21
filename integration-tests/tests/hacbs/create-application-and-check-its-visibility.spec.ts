import { AddComponentPage } from "../../support/pages/AddComponentPage";
import { ApplicationDetailPage } from "../../support/pages/ApplicationDetailPage";
import { ComponentPage } from "../../support/pages/ComponentsPage";
import { Applications } from "../../utils/Applications";
import { Common } from "../../utils/Common";
import { breadcrumbs } from '../../support/pageObjects/global-po';


describe('Create Application and check if its visible', () => {
    const applicationName = Common.generateAppName();
    const addComponent = new AddComponentPage();
    const componentPage = new ComponentPage();
    const applicationDetailPage = new ApplicationDetailPage();
    const publicRepo = 'https://github.com/dheerajodha/devfile-sample-code-with-quarkus';
    const componentName = 'java-quarkus';

    after(function () {
        //Open components page
        Common.openApplicationURL(applicationName);
        applicationDetailPage.deleteComponent(componentName);
        applicationDetailPage.createdComponentNotExists(componentName);
        Applications.deleteApplication(applicationName);
    });

    describe('Create an Application with a component', () => {
        it('Check empty state of the "Application List" page', () => {
            Common.openAppStudioBaseURL();
            cy.get('tbody>tr').eq(0).should("not.exist");
        })

        it('Validate Repo', () => {
            // Enter git repo URL
            addComponent.setSource(publicRepo);
            // Check if the source is validated
            addComponent.waitRepoValidated();
        });

        it('Setup Git Options', () => {
            addComponent.clickGitOptions();

            //Next block commented out because of bug:
            //https://issues.redhat.com/browse/HAC-1285

            //addComponent.setGitReference(gitReference);
            //addComponent.setContextDir(contextDir);
            addComponent.clickNext();
        });

        it('Create Application', () => {
            componentPage.createApplication();
            applicationDetailPage.createdComponentExists(componentName, applicationName);
        });

        it('Check if Application is visible in "Application List" page', () => {
            Common.openAppStudioBaseURL();
            Applications.createdApplicationExists(applicationName);
        })
    })

})
