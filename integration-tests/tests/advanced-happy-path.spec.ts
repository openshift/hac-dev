import {
  applicationDetailPagePO,
  ComponentsPagePO,
} from '../support/pageObjects/createApplication-po';
import { ApplicationDetailPage } from '../support/pages/ApplicationDetailPage';
import { ComponentPage } from '../support/pages/ComponentsPage';
import { LatestCommitsTabPage } from '../support/pages/tabs/LatestCommitsTabPage';
import { PipelinerunsTabPage } from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';

describe('Create Components using the UI', () => {
  const applicationName = Common.generateAppName();
  const applicationDetailPage = new ApplicationDetailPage();
  const componentPage = new ComponentPage();
  const pipelinerunsTabPage = new PipelinerunsTabPage();
  const latestCommitsTabPage = new LatestCommitsTabPage();
  const sourceCodeRepoLink = 'https://github.com/devfile-samples/devfile-sample-go-basic';
  const repoName = Common.generateAppName('devfile-sample-go-basic');
  const repoOwner = 'redhat-hac-qe';
  const repoLink = `https://github.com/${repoOwner}/${repoName}`;

  let componentName = 'go';
  const componentInfo = new Map<string, string>();

  componentInfo.set('componentName', 'go');
  componentInfo.set('deploymentBodyOriginal', 'Hello, !');
  componentInfo.set('deploymentBodyUpdated', 'Bye, !');
  componentInfo.set('filePath', 'main.go');
  componentInfo.set(
    'goFileBase64Original',
    'cGFja2FnZSBtYWluCgppbXBvcnQgKAoJImZtdCIKCSJuZXQvaHR0cCIKCSJmbGFnIgopCnZhciBwb3J0ID0gZmxhZy5JbnQoInAiLCA4MDgwLCAic2VydmVyIHBvcnQiKQoKZnVuYyBtYWluKCkgewoJZmxhZy5QYXJzZSgpCglodHRwLkhhbmRsZUZ1bmMoIi8iLCBIZWxsb1NlcnZlcikKCWh0dHAuTGlzdGVuQW5kU2VydmUoZm10LlNwcmludGYoIjAuMC4wLjA6JWQiLCAqcG9ydCksIG5pbCkKfQoKZnVuYyBIZWxsb1NlcnZlcih3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCkgewoJZm10LkZwcmludGYodywgIkhlbGxvLCAlcyEiLCByLlVSTC5QYXRoWzE6XSkKfQo=',
  );
  componentInfo.set(
    'goFileBase64Updated',
    'cGFja2FnZSBtYWluCgppbXBvcnQgKAoJImZtdCIKCSJuZXQvaHR0cCIKCSJmbGFnIgopCnZhciBwb3J0ID0gZmxhZy5JbnQoInAiLCA4MDgwLCAic2VydmVyIHBvcnQiKQoKZnVuYyBtYWluKCkgewoJZmxhZy5QYXJzZSgpCglodHRwLkhhbmRsZUZ1bmMoIi8iLCBIZWxsb1NlcnZlcikKCWh0dHAuTGlzdGVuQW5kU2VydmUoZm10LlNwcmludGYoIjAuMC4wLjA6JWQiLCAqcG9ydCksIG5pbCkKfQoKZnVuYyBIZWxsb1NlcnZlcih3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCkgewoJZm10LkZwcmludGYodywgIkJ5ZSwgJXMhIiwgci5VUkwuUGF0aFsxOl0pCn0K',
  );
  componentInfo.set('goFileSHAOriginal', 'a0d3381107a344f57e4a4f7edb82eab9c457aa0f');
  componentInfo.set('goFileSHAUpdated', 'f395a5944d9e9c3ee88c348cb836a15af4115cea');
  componentInfo.set('commitMessageUpdate', 'Changing the string value inside HelloServer func');
  componentInfo.set(
    'commitMessageRevert',
    'Revert: Changing the string value inside HelloServer func',
  );

  before(() => {
    Common.createGitHubRepository(repoName);
    Common.importCodeToGitHubRepository(sourceCodeRepoLink, repoName);
  });

  after(function () {
    // Revert the changes made to the file
    latestCommitsTabPage.editFile(
      repoLink,
      componentInfo.get('filePath'),
      componentInfo.get('commitMessageRevert'),
      componentInfo.get('goFileBase64Original'),
      componentInfo.get('goFileSHAUpdated'),
    );

    Applications.deleteApplication(applicationName);
    Common.deleteGitHubRepository(repoOwner, repoName);
  });

  describe('Create an Application with a component', () => {
    it('Set Application Name', () => {
      Applications.createApplication(applicationName);
    });

    it('Add a component to Application', () => {
      componentName = Common.generateAppName(componentName);

      Applications.createComponent(repoLink, componentName, 'Go', true);
    });
  });

  describe('Trigger a new Pipelinerun related to push event', () => {
    it('Merge the auto-generated PR, and verify the event status on modal', () => {
      componentPage.checkStatusOnModal(ComponentsPagePO.customBuildPendingState);

      latestCommitsTabPage.mergePR(componentName, repoLink);

      componentPage.checkStatusOnModal(ComponentsPagePO.customBuildReadyState);
      componentPage.closeModal();
    });

    it('Record the commits on the PR', () => {
      latestCommitsTabPage.fetchCommitSHAOnPR(componentName, repoLink);
    });

    it('Check the component', () => {
      Applications.checkComponentInListView(
        componentName,
        applicationName,
        'Build Running',
        'Custom build',
      );
    });
  });

  describe('Explore "Pipeline runs" Tab', () => {
    it('Verify the PipelineRuns List view', () => {
      Applications.goToPipelinerunsTab();

      cy.get('tbody', { timeout: 60000 })
        .find('tr')
        .then((row) => {
          for (let i = 0; i < row.length; i++) {
            cy.get('tbody tr', { timeout: 40000 })
              .eq(i)
              .then(($row) => {
                cy.wrap($row)
                  .find('td')
                  .eq(0)
                  .find('a')
                  .then((pipelinerunName) => {
                    Applications.createdPipelinerunSucceeded(pipelinerunName.text().trim(), true);
                    pipelinerunsTabPage.pipelineRunList.push(pipelinerunName.text().trim());
                  });
              });
          }
        });
    });
  });

  describe('Explore "Latest commits" Tab', () => {
    it('Verify the Commits List view', () => {
      Applications.goToLatestCommitsTab();

      for (const commitObject of latestCommitsTabPage.commitList) {
        Common.checkRowValues(commitObject.sha, [
          commitObject.title,
          'main',
          componentName,
          commitObject.user,
          'Succeeded',
        ]);
      }
    });
  });

  describe('Check Component Deployment', () => {
    it('Verify the status code and response body of the deployment URL of each component', () => {
      Applications.goToComponentsTab();

      applicationDetailPage.expandDetails(componentName);

      cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 })
        .invoke('text')
        .then((route) => {
          Common.checkResponseBodyAndStatusCode(
            route,
            componentInfo.get('deploymentBodyOriginal'),
            2000,
          );
        });

      Applications.checkComponentStatus(componentName, 'Build Succeeded');
    });
  });

  describe('Add a new commit and verify changes in the Route', () => {
    it('Add a new commit with changes to a file', () => {
      latestCommitsTabPage.editFile(
        repoLink,
        componentInfo.get('filePath'),
        componentInfo.get('commitMessageUpdate'),
        componentInfo.get('goFileBase64Updated'),
        componentInfo.get('goFileSHAOriginal'),
      );
    });

    it('Check the new Pipeline run', () => {
      Applications.goToPipelinerunsTab();

      cy.get('tbody tr', { timeout: 20000 })
        .eq(0)
        .then(($row) => {
          cy.wrap($row).find('td').eq(3).find('span').eq(1).should('have.text', 'Running');
          cy.wrap($row)
            .find('td')
            .eq(0)
            .find('a')
            .then((pipelinerunName) => {
              Applications.createdPipelinerunSucceeded(pipelinerunName.text().trim(), true);
              pipelinerunsTabPage.pipelineRunList.push(pipelinerunName.text().trim());
            });
        });
    });

    it('Verify the Commits List view', () => {
      Applications.goToLatestCommitsTab();

      for (const commitObject of latestCommitsTabPage.commitList) {
        if (commitObject.title === componentInfo.get('commitMessageUpdate')) {
          Common.checkRowValues(commitObject.sha, [
            commitObject.title,
            'main',
            componentName,
            commitObject.user,
            'Succeeded',
          ]);
        }
      }
    });

    it('Verify that the component deployment reflects latest changes', () => {
      Applications.goToComponentsTab();

      applicationDetailPage.expandDetails(componentName);

      cy.get(applicationDetailPagePO.route(componentName), { timeout: 240000 })
        .invoke('text')
        .then((route) => {
          Common.checkResponseBodyAndStatusCode(
            route,
            componentInfo.get('deploymentBodyUpdated'),
            30000,
          );
        });

      Applications.checkComponentStatus(componentName, 'Build Succeeded');
    });
  });
});
