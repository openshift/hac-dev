import { UIhelper } from '../../../utils/UIhelper';
import { pipelinerunsTabPO } from '../../pageObjects/pages-po';

type taskRunDetailsRow = {
  name: string | RegExp;
  task: string;
  status: string;
};

// Pipelineruns List view page
export class PipelinerunsTabPage {
  static clickOnRunningPipelinerun(pipelinerun: string) {
    UIhelper.clickRowCellInTable('Pipeline run List', 'Running', `${pipelinerun}-`);
  }

  static verifyRelatedPipelines(pipelineName: string) {
    cy.contains(pipelinerunsTabPO.relatedPipelinePopup, 'Related pipelines').within(() => {
      cy.contains(pipelineName).scrollIntoView().should('be.visible');
      cy.get(pipelinerunsTabPO.relatedPipelineCloseBtn).click().should('not.exist');
    });
  }
}

// Pipelineruns Details view page
export class DetailsTab {
  static goToDetailsTab() {
    cy.get(pipelinerunsTabPO.clickDetailsTab).click();
  }

  static waitUntilStatusIsNotRunning() {
    cy.get(pipelinerunsTabPO.statusPO, { timeout: 1000000 })
      .should('not.have.text', 'Pending')
      .and('not.have.text', 'Running');
  }

  static checkStatusSucceeded(taskNames: taskRunDetailsRow[]) {
    cy.get(pipelinerunsTabPO.statusPO)
      .invoke('text')
      .then((text) => {
        if (text.includes('Succeeded')) {
          UIhelper.clickTab('Task runs');
          TaskRunsTab.assertTaskNamesAndTaskRunStatus(taskNames);
        } else if (text.includes('Failed')) {
          LogsTab.goToLogsTab();
          LogsTab.downloadAllTaskLogs();
          cy.screenshot('capture-logs-on-pipelinerun-failure', { capture: 'fullPage' });
        }
      });
  }
}

export class TaskRunsTab {
  static getAdvancedTaskNamesList(pipelineName: string): taskRunDetailsRow[] {
    return [
      { name: `${pipelineName}-init`, task: 'init', status: 'Succeeded' },
      { name: `${pipelineName}-clone-repository`, task: 'git-clone', status: 'Succeeded' },
      { name: `${pipelineName}-build-container`, task: 'buildah', status: 'Succeeded' },
      { name: `${pipelineName}-inspect-image`, task: 'inspect-image', status: 'Succeeded' },
      {
        name: `${pipelineName}-deprecated-base-image-check`,
        task: 'deprecated-image-check',
        status: 'Succeeded',
      },
      { name: `${pipelineName}-sbom-json-check`, task: 'sbom-json-check', status: 'Succeeded' },
      { name: `${pipelineName}-clair-scan`, task: 'clair-scan', status: 'Succeeded|Test Failures' }, // Adding Test Warnings as some packages might have medium vulnerabilities sometimes
      { name: `${pipelineName}-clamav-scan`, task: 'clamav-scan', status: 'Succeeded' },
      { name: `${pipelineName}-label-check`, task: 'label-check', status: 'Succeeded' },
      {
        name: `${pipelineName}-optional-label-check`,
        task: 'label-check',
        status: 'Succeeded|Test Failures',
      }, // Adding Test Failures as This optional check currently gives warning.
      { name: `${pipelineName}-show-summary`, task: 'summary', status: 'Succeeded' },
    ];
  }
  static getbasicTaskNamesList(pipelineName: string): taskRunDetailsRow[] {
    return [
      { name: `${pipelineName}-init`, task: 'init', status: 'Succeeded' },
      { name: `${pipelineName}-clone-repository`, task: 'git-clone', status: 'Succeeded' },
      { name: `${pipelineName}-build-container`, task: 'buildah', status: 'Succeeded' },
      { name: `${pipelineName}-show-summary`, task: 'summary', status: 'Succeeded' },
    ];
  }

  static assertTaskNamesAndTaskRunStatus(taskNames: taskRunDetailsRow[]) {
    taskNames.forEach((taskNameRow) => {
      UIhelper.verifyRowInTable('TaskRun List', taskNameRow.name, [
        new RegExp(`^${taskNameRow.task}$`),
        new RegExp(`${taskNameRow.status}`),
      ]);
    });
  }
}

export class LogsTab {
  static goToLogsTab() {
    cy.get(pipelinerunsTabPO.clickLogsTab).click();
  }

  static downloadAllTaskLogs() {
    cy.contains('button', pipelinerunsTabPO.downloadAllTaskLogsButton).click();
  }
}
