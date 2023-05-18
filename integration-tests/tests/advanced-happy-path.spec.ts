import { applicationDetailPagePO } from '../support/pageObjects/createApplication-po';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { IntegrationTestsTabPage } from '../support/pages/tabs/IntegrationTestsTabPage';
import { LatestCommitsTabPage } from '../support/pages/tabs/LatestCommitsTabPage';
import {
  DetailsTab,
  PipelinerunsTabPage,
  TaskRunsTab,
} from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';

describe('Advanced Happy path', () => {
  const applicationName = Common.generateAppName();
  const applicationDetailPage = new ApplicationDetailPage();
  const componentPage = new ComponentPage();
  const latestCommitsTabPage = new LatestCommitsTabPage();
  const integrationTestsTabPage = new IntegrationTestsTabPage();
  const sourceCodeRepoLink = 'https://github.com/hac-test/devfile-sample-go-basic';
  const repoName = Common.generateAppName('devfile-sample-go-basic');
  const repoOwner = 'redhat-hac-qe';
  const repoLink = `https://github.com/${repoOwner}/${repoName}`;
  const gitHubUser = Cypress.env('GH_USERNAME');
  const componentName = Common.generateAppName('go');

  const componentInfo: { [key: string]: string } = {
    deploymentBodyOriginal: 'Hello World!',
    deploymentBodyUpdated: 'Bye World!',
    filePath: 'main.go',
    firstCommitTitle: 'firstCommit',
    firstCommitMessage: 'This PR was auto-generated by appstudio-ci__bot',
    updatedCommitMessage: 'secondCommit',
  };

  const integrationTestDetails: { [key: string]: string } = {
    integrationTestName: Common.generateAppName('integration-tests'),
    integrationTestNameTemp: Common.generateAppName('integration-tests-temp'),
    imageBundle: 'quay.io/redhat-appstudio/example-tekton-bundle:integration-pipeline-fail',
    pipelineToRun: 'integration-pipeline-fail',
    imageBundleEdit: 'quay.io/redhat-appstudio/example-tekton-bundle:integration-pipeline-pass',
    pipelineToRunEdit: 'integration-pipeline-pass',
  };

  const integrationTestTaskNames = ['task-success', 'task-success-2', 'task-skipped'];
  const vulnerabilities = /Critical(\d+).*High(\d+).*Medium(\d+).*Low(\d+)/g;

  before(() => {
    Common.createGitHubRepository(repoName);
    Common.importCodeToGitHubRepository(sourceCodeRepoLink, repoName);
    Common.githubRequest(
      'GET',
      `https://api.github.com/repos/hac-test/devfile-sample-go-basic/contents/${componentInfo.filePath}`,
    ).then((response) => {
      componentInfo.goFileSHAOriginal = response.body.sha;
      componentInfo.goFileBase64Original = response.body.content;
    });
  });

  after(function () {
    Common.deleteGitHubRepository(repoOwner, repoName);
    Applications.deleteApplication(applicationName);
  });

  it('Create an Application with a component', () => {
    Applications.createApplication();
    Applications.createComponent(repoLink, componentName, applicationName, 'Go', true, {
      varName: 'TEST_ENV_VAR',
      value: 'Test go app',
    });
  });

  describe('Trigger a new Pipelinerun related to push event', () => {
    it('Merge the auto-generated PR, and verify the event status on modal', () => {
      componentPage.verifyAndWaitForPRIsSent();

      latestCommitsTabPage.mergePR(
        repoOwner,
        repoName,
        1,
        componentInfo.firstCommitTitle,
        componentInfo.firstCommitMessage,
      );

      componentPage.verifyAndWaitForPRMerge();
      componentPage.closeModal();
    });

    it('Validate the component', () => {
      Applications.checkComponentInListView(
        componentName,
        applicationName,
        'Build Running',
        'Custom',
      );
    });

    it('Verify the Pipeline run details and Task runs', () => {
      Applications.goToPipelinerunsTab();
      cy.contains(`${componentName}-on-push`)
        .invoke('text')
        .then((pipelinerunName) => {
          componentInfo.firstPipelineRunName = pipelinerunName;
          UIhelper.clickLink(componentInfo.firstPipelineRunName);
          DetailsTab.waitUntilStatusIsNotRunning();
          DetailsTab.checkStatusSucceeded(
            TaskRunsTab.getAdvancedTaskNamesList(componentInfo.firstPipelineRunName),
          );
        });
    });
  });

  describe('Verify CVE scan', () => {
    it('Verify clair scan node details on drawer Panel', () => {
      UIhelper.clickTab('Details');
      DetailsTab.clickOnNode('clair-scan');
      DetailsTab.checkVulScanOnClairDrawer(vulnerabilities);
      DetailsTab.checkNodeDrawerPanelResult('TEST_OUTPUT', '"result":"SUCCESS"');
      DetailsTab.clickOnDrawerPanelLogsTab();
      DetailsTab.verifyLogs('Task clair-scan completed');
      DetailsTab.closeDrawerPanel();
    });

    it('Verify vulnebralities on pipeline run Details Page', () => {
      DetailsTab.checkVulScanOnPipelinerunDetails(vulnerabilities);
      DetailsTab.clickOnVulScanViewLogs();
      DetailsTab.verifyLogs('Task clair-scan completed');
    });

    it('Verify vulnebralities on pipeline run list', () => {
      Applications.clickBreadcrumbLink('Pipeline runs');
      UIhelper.getTableRow('Pipeline run List', componentInfo.firstPipelineRunName).within(() => {
        cy.contains(vulnerabilities).should('be.visible');
      });
    });
  });
  describe('Check Component Deployment', () => {
    it('Verify the status code and response body of the deployment URL of each component', () => {
      Applications.goToComponentsTab();
      applicationDetailPage.expandDetails(componentName);

      cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 })
        .invoke('text')
        .then((route) => {
          Common.checkResponseBodyAndStatusCode(route, componentInfo.deploymentBodyOriginal, 5000);
        });

      Applications.checkComponentStatus(componentName, 'Build Succeeded');
    });
  });

  describe('Add and edit integration test', () => {
    it('Add integration test and verify', () => {
      UIhelper.clickTab('Integration tests');
      integrationTestsTabPage.clickOnAddIntegrationTestBtn();
      integrationTestsTabPage.addIntegrationTest(
        integrationTestDetails.integrationTestName,
        integrationTestDetails.imageBundle,
        integrationTestDetails.pipelineToRun,
        'check',
      );
      integrationTestsTabPage.verifyRowInIntegrationTestsTable({
        name: integrationTestDetails.integrationTestName,
        ContainerImage: integrationTestDetails.imageBundle,
        optionalForRelease: 'Optional',
        pipelines: integrationTestDetails.pipelineToRun,
      });
    });

    it('Add integration test from Actions and verify', () => {
      Applications.clickActionsDropdown('Add integration test');
      integrationTestsTabPage.addIntegrationTest(
        integrationTestDetails.integrationTestNameTemp,
        integrationTestDetails.imageBundle,
        integrationTestDetails.pipelineToRun,
      );
      integrationTestsTabPage.verifyRowInIntegrationTestsTable({
        name: integrationTestDetails.integrationTestNameTemp,
        ContainerImage: integrationTestDetails.imageBundle,
        optionalForRelease: 'Mandatory',
        pipelines: integrationTestDetails.pipelineToRun,
      });
    });

    it('Edit integration test and verify', () => {
      integrationTestsTabPage.openAndClickKebabMenu(
        integrationTestDetails.integrationTestName,
        'Edit',
      );
      Common.waitForLoad();
      integrationTestsTabPage.editIntegrationTest(
        integrationTestDetails.imageBundleEdit,
        integrationTestDetails.pipelineToRunEdit,
        'uncheck',
      );
      integrationTestsTabPage.verifyRowInIntegrationTestsTable({
        name: integrationTestDetails.integrationTestName,
        ContainerImage: integrationTestDetails.imageBundleEdit,
        optionalForRelease: 'Mandatory',
        pipelines: integrationTestDetails.pipelineToRunEdit,
      });
    });

    it('Delete one of integration test and verify', () => {
      UIhelper.clickLink(integrationTestDetails.integrationTestNameTemp);
      integrationTestsTabPage.deleteIntegrationTestFromActions();
      cy.contains(integrationTestDetails.integrationTestNameTemp).should('not.exist');
    });
  });

  describe('Add a new commit and verify Build Pipeline run', () => {
    it('Add a new commit with changes to a file', () => {
      const goFileUpdated = Buffer.from(componentInfo.goFileBase64Original, 'base64')
        .toString('utf8')
        .replace(componentInfo.deploymentBodyOriginal, componentInfo.deploymentBodyUpdated);

      latestCommitsTabPage.editFile(
        repoLink,
        componentInfo.filePath,
        componentInfo.updatedCommitMessage,
        Buffer.from(goFileUpdated).toString('base64'),
        componentInfo.goFileSHAOriginal,
      );
    });

    it('Verify and wait for the new Pipeline run', () => {
      Applications.goToPipelinerunsTab();
      UIhelper.getTableRow('Pipeline run List', /Running|Pending/)
        .contains(`${componentName}-on-push`)
        .invoke('text')
        .then((pipelinerunName) => {
          componentInfo.secondPipelineRunName = pipelinerunName;
          UIhelper.clickLink(componentInfo.secondPipelineRunName);
          DetailsTab.waitUntilStatusIsNotRunning();
          DetailsTab.checkStatusSucceeded(
            TaskRunsTab.getAdvancedTaskNamesList(componentInfo.secondPipelineRunName),
          );
        });
    });
  });

  describe('Verify Integration Test Pipeline Runs on Activity Tab', () => {
    it('Verify Integration Test pipeline run Details', () => {
      Applications.clickBreadcrumbLink('Pipeline runs');
      UIhelper.verifyRowInTable('Pipeline run List', `${applicationName}-`, [/^Test$/]);
      UIhelper.clickRowCellInTable(
        'Pipeline run List',
        `${applicationName}-`,
        `${applicationName}-`,
      );
      DetailsTab.waitUntilStatusIsNotRunning();
      UIhelper.verifyLabelAndValue('Status', 'Succeeded');
      UIhelper.verifyLabelAndValue('Pipeline', integrationTestDetails.pipelineToRunEdit);
      UIhelper.verifyLabelAndValue('Related pipelines', '1 pipeline').click();
      PipelinerunsTabPage.verifyRelatedPipelines(componentInfo.secondPipelineRunName);
    });

    it('Verify Integration Test pipeline run graph', () => {
      UIhelper.verifyGraphNodes(integrationTestTaskNames[0]);
      UIhelper.verifyGraphNodes(integrationTestTaskNames[1]);
      UIhelper.verifyGraphNodes(integrationTestTaskNames[2], false);
    });

    it('Verify Integration Test pipeline runs Task runs & Logs Tab', () => {
      UIhelper.clickTab('Task runs');
      TaskRunsTab.assertTaskNamesAndTaskRunStatus([
        {
          name: new RegExp(`${applicationName}-.*-${integrationTestTaskNames[0]}`),
          task: 'test-output',
          status: 'Succeeded',
        },
        {
          name: new RegExp(`${applicationName}-.*-${integrationTestTaskNames[1]}`),
          task: 'test-output',
          status: 'Succeeded',
        },
      ]);
      UIhelper.clickTab('Logs');
      applicationDetailPage.verifyBuildLogTaskslist(integrationTestTaskNames);
    });
  });

  describe('Verify Integration Test Details on Integration tests Tab', () => {
    it('Verify Integration Tests Overview page', () => {
      Applications.clickBreadcrumbLink(applicationName);
      UIhelper.clickTab('Integration tests');
      UIhelper.clickLink(integrationTestDetails.integrationTestName);
      UIhelper.verifyLabelAndValue('Name', integrationTestDetails.integrationTestName);
      UIhelper.verifyLabelAndValue('Image bundle', integrationTestDetails.imageBundleEdit);
      UIhelper.verifyLabelAndValue('Pipeline to run', integrationTestDetails.pipelineToRunEdit);
      UIhelper.verifyLabelAndValue('Optional for release', 'Mandatory');
    });

    it('Verify Integration Tests Pipeline runs page', () => {
      UIhelper.clickTab('Pipeline runs');
      UIhelper.verifyRowInTable('Pipeline run List', `${applicationName}-`, [
        /Succeeded/,
        /^Test$/,
      ]);
    });
  });

  describe('Verify new commit updates in Components Tab', () => {
    it('Verify that the component deployment reflects latest changes', () => {
      Applications.clickBreadcrumbLink(applicationName);
      Applications.goToComponentsTab();

      applicationDetailPage.expandDetails(componentName);

      cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 })
        .invoke('text')
        .then((route) => {
          Common.checkResponseBodyAndStatusCode(
            route,
            componentInfo.deploymentBodyUpdated,
            20000,
            0,
            20,
          );
        });

      Applications.checkComponentStatus(componentName, 'Build Succeeded');
    });

    it('Verify view pod logs', () => {
      applicationDetailPage.openPodLogs(componentName);
      cy.contains('Pod status: Running').should('be.visible');
      applicationDetailPage.checkPodLog('my-go', 'TEST_ENV_VAR : Test go app');
      applicationDetailPage.closeBuildLog();
    });
  });

  describe('Verify Latest commits and Pipeline runs in Activity Tab', () => {
    it('Verify the Commits List view should have both the commits', () => {
      Applications.goToLatestCommitsTab();
      UIhelper.verifyRowInTable('Commit List', componentInfo.firstCommitTitle, [
        'main',
        componentName,
        gitHubUser,
        'Succeeded',
      ]);
      UIhelper.verifyRowInTable('Commit List', componentInfo.updatedCommitMessage, [
        'main',
        componentName,
        gitHubUser,
        'Succeeded',
      ]);
    });

    it('Verify the Commit Overview Tab of the Last Commit', () => {
      latestCommitsTabPage.clickOnCommit(componentInfo.updatedCommitMessage);
      latestCommitsTabPage.verifyCommitsPageTitleAndStatus(componentInfo.updatedCommitMessage);
      latestCommitsTabPage.verifyCommitID(
        Cypress.env(`${componentInfo.updatedCommitMessage}_SHA`),
        repoLink,
      ); // Commit SHA was stored in dynamic env at latestCommitsTabPage.editFile()
      latestCommitsTabPage.verifyBranch('main', repoLink);
      UIhelper.verifyLabelAndValue('By', gitHubUser);
      UIhelper.verifyLabelAndValue('Status', 'Succeeded');
      latestCommitsTabPage.verifyNodesOnCommitOverview([
        'commit',
        `${componentName}-build`,
        'development',
      ]);
    });

    it('verify the Commit Pipeline runs Tab', () => {
      UIhelper.clickTab('Pipeline runs');
      UIhelper.verifyRowInTable('Pipelinerun List', `${applicationName}-`, ['Succeeded', 'Test']);
      UIhelper.verifyRowInTable('Pipelinerun List', componentInfo.secondPipelineRunName, [
        'Succeeded',
        'Build',
      ]);
    });
  });

  describe('Verify application Lifecycle nodes on Overview page', () => {
    it('check Lifecycle Nodes', () => {
      Applications.clickBreadcrumbLink(applicationName);
      Common.waitForLoad();
      UIhelper.verifyGraphNodes('Components', false);
      UIhelper.verifyGraphNodes('Builds');
      UIhelper.verifyGraphNodes('Tests');
      UIhelper.verifyGraphNodes('Static environments');
    });
  });

  describe('Verify the Recent Commits section on application overview page', () => {
    it('Verify the Commits List view should have both the commits', () => {
      Applications.goToOverviewTab();
      UIhelper.verifyRowInTable('Commit List', componentInfo.firstCommitTitle, [
        'main',
        componentName,
        gitHubUser,
        'Succeeded',
      ]);
      UIhelper.verifyRowInTable('Commit List', componentInfo.updatedCommitMessage, [
        'main',
        componentName,
        gitHubUser,
        'Succeeded',
      ]);
    });

    it('Verify the Commit Overview Tab of the Last Commit', () => {
      latestCommitsTabPage.clickOnCommit(componentInfo.updatedCommitMessage);
      latestCommitsTabPage.verifyCommitsPageTitleAndStatus(componentInfo.updatedCommitMessage);
      latestCommitsTabPage.verifyCommitID(
        Cypress.env(`${componentInfo.updatedCommitMessage}_SHA`),
        repoLink,
      );
      latestCommitsTabPage.verifyBranch('main', repoLink);
      latestCommitsTabPage.verifyNodesOnCommitOverview([
        'commit',
        `${componentName}-build`,
        'development',
      ]);
    });

    it('verify the Commit Pipeline runs Tab', () => {
      UIhelper.clickTab('Pipeline runs');
      UIhelper.verifyRowInTable('Pipelinerun List', componentInfo.secondPipelineRunName, [
        'Succeeded',
        'Build',
      ]);
    });
  });
});
