import { AddComponentPage } from '../support/pages/AddComponentPage';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { DetailsTab, TaskRunsTab } from '../support/pages/tabs/PipelinerunsTabPage';
import { APIHelper } from '../utils/APIHelper';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';

describe('Create Component from Private Git Using Login Form', () => {
  const piplinerunlogsTasks = ['init', 'clone-repository', 'build-container', 'show-summary'];
  const sourceOwner = 'hac-test';
  const sourceRepo = 'devfile-sample-code-with-quarkus';
  const repoName = Common.generateAppName(sourceRepo);
  const applicationName = Common.generateAppName();
  const componentName: string = Common.generateAppName('private-quarkus');
  const repoOwner = 'redhat-hac-qe';
  let privateRepo = `https://github.com/${repoOwner}/${repoName}`;
  const pipeline = 'docker-build';

  before(function () {
    APIHelper.createRepositoryFromTemplate(sourceOwner, sourceRepo, repoOwner, repoName, true);
  });

  after(function () {
    // If some test failed, don't remove the app
    let allTestsSucceeded = true;
    this.test.parent.eachTest((test) => {
      if (test.state === 'failed') {
        allTestsSucceeded = false;
      }
    });
    if (allTestsSucceeded || Cypress.env('REMOVE_APP_ON_FAIL')) {
      Applications.deleteApplication(applicationName);
      APIHelper.deleteGitHubRepository(repoName);
    }
  });

  describe('Creating Component From Private Github Repo', () => {
    it('Create an Application with a component', () => {
      Applications.createApplication(applicationName);
      Applications.createComponent(privateRepo, componentName, pipeline, true);
      Applications.checkComponentInListView(componentName, applicationName, 'Build running');
    });

    it('Verify the Pipeline run details and Node Graph view', () => {
      Applications.goToPipelinerunsTab();
      UIhelper.getTableRow('Pipeline run List', `${componentName}-on-pull-request`)
        .contains(componentName)
        .invoke('text')
        .then((pipelinerunName) => {
          UIhelper.clickRowCellInTable('Pipeline run List', pipelinerunName, pipelinerunName);
          UIhelper.verifyLabelAndValue('Namespace', Cypress.env('HAC_NAMESPACE'));
          UIhelper.verifyLabelAndValue('Pipeline', pipelinerunName);
          UIhelper.verifyLabelAndValue('Application', applicationName);
          UIhelper.verifyLabelAndValue('Component', componentName);
          UIhelper.verifyLabelAndValue('Related pipelines', '0 pipelines');

          DetailsTab.waitForPLRAndDownloadAllLogs();

          //Verify the Pipeline run details Graph
          piplinerunlogsTasks.forEach((item) => {
            UIhelper.verifyGraphNodes(item);
          });

          TaskRunsTab.goToTaskrunsTab();
          TaskRunsTab.assertTaskAndTaskRunStatus(
            TaskRunsTab.getbasicTaskNamesList(pipelinerunName),
          );
        });
    });
  });

  describe('Check component details', () => {
    before(function () {
      DetailsTab.goToDetailsTab();
      UIhelper.clickLink(componentName);
    });

    it('Verify that quay.io repo is private', () => {
      ComponentPage.checkQuayImageIsPrivate();
    });
  });
});
