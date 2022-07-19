import { AddComponentPage } from "../../support/pages/AddComponentPage";
import { ApplicationDetailPage } from "../../support/pages/ApplicationDetailPage";
import { ComponentPage } from "../../support/pages/ComponentsPage";
import { Applications } from "../../utils/Applications";
import { Common } from "../../utils/Common";
import { breadcrumbs } from '../../support/pageObjects/global-po';


describe('', () => {
    const applicationName = Common.generateAppName();
    const addComponent = new AddComponentPage();
    const componentPage = new ComponentPage();
    const applicationDetailPage = new ApplicationDetailPage();
    const publicRepo = 'https://github.com/dheerajodha/devfile-sample-code-with-quarkus';
    const componentName = 'java-quarkus';

    before(function () {        
        describe('Create an Application with a component', () => {
            it('Set Application Name', () => {
                Applications.createApplication(applicationName);
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
        })
    });

    after(function () {
        //Open components page
        Common.openApplicationURL(applicationName);
        applicationDetailPage.deleteComponent(componentName);
        applicationDetailPage.createdComponentNotExists(componentName);
        Applications.deleteApplication(applicationName);
    });

    describe('Creating a Quarkus Component', () => {
        it("Enable HACBS", () => {
            Common.enableHACBS();
        });

        it("Add a new component via HACBS 'Components' tabs", () => {
            //Open components page
            Common.openApplicationURL(applicationName);
            
        });
    })

})
