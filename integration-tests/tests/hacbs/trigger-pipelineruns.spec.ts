import { Applications } from "../../utils/Applications";
import { HACBSApplications } from "../../utils/HACBSApplications";

describe('Create Components using the HACBS UI', () => {
    const LOCAL_STORAGE_KEY_GS_MODAL = 'hacbs/getting-started-modal';
    const LOCAL_STORAGE_KEY_QUICKSTART = 'hacbs/showApplicationQuickstart';
    const applicationName = "my-application";
    const publicRepo = "https://github.com/dheerajodha/devfile-sample-code-with-quarkus";
    const componentName = 'java-quarkus';
    const pipelinerunsNames = ['java-quarkus-on-push', 'java-quarkus-on-pull-request'];

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
            HACBSApplications.createComponent(publicRepo, componentName, true);
            HACBSApplications.createdPipelinerunsSucceeded(pipelinerunsNames, componentName, applicationName);
            HACBSApplications.createdComponentExists(componentName, applicationName);
        });
    });
});
