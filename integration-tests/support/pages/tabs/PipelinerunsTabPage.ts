import { UIhelper } from '../../../utils/UIhelper';
import { pipelinerunsTabPO } from '../../pageObjects/pages-po';
import { hacAPIEndpoints } from '../../../utils/APIEndpoints';
import { APIHelper } from '../../../utils/APIHelper';

type taskRunDetailsRow = {
  name: string | RegExp;
  task: string;
  status: string;
};

type ecSecurityRulesRow = {
  rule: string | RegExp;
  status: string | RegExp;
  message: string | RegExp;
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

  static getPipelineRunNameByLabel(
    applicationName: string,
    label: string,
    annotations?: { key: string; value: string },
  ) {
    return APIHelper.requestHACAPI({
      url: hacAPIEndpoints.pipelinerunsFilter(applicationName, label),
    })
      .its('body.items')
      .then((items) => {
        if (!annotations) {
          return items[0].metadata.name;
        }
        for (let i in items) {
          if (items[i].metadata.annotations[annotations.key] === annotations.value) {
            return items[i].metadata.name;
          }
        }
      });
  }

  static verifyECSecurityRulesResultSummary(summary: RegExp) {
    cy.contains(pipelinerunsTabPO.ecResultSummary, summary).should('be.visible');
  }

  static verifyECSecurityRules(UniqueTextInRow: string | RegExp, rowValues: ecSecurityRulesRow) {
    cy.contains(pipelinerunsTabPO.ecSecurityRulesTableRow, UniqueTextInRow).within(() => {
      cy.contains(rowValues.rule).scrollIntoView().should('be.visible');
      cy.contains(rowValues.status).scrollIntoView().should('be.visible');
      cy.contains(rowValues.message).scrollIntoView().should('be.visible');
    });
  }
}

// Pipelineruns Details view page
export class DetailsTab {
  static goToDetailsTab() {
    UIhelper.clickTab('Details');
  }

  static waitUntilStatusIsNotRunning() {
    cy.get(pipelinerunsTabPO.statusPO, { timeout: 1000000 })
      .should('not.have.text', 'Pending')
      .and('not.have.text', 'Running');
  }

  static clickOnNode(nodeId: string) {
    cy.get(pipelinerunsTabPO.node(nodeId)).click();
  }

  static checkNodeDrawerPanelResult(section: string, value: string) {
    cy.contains(pipelinerunsTabPO.PF5TableRow, section)
      .contains(value)
      .scrollIntoView()
      .should('be.visible');
  }

  static checkVulScanOnClairDrawer(vulnerabilities: RegExp) {
    cy.get(pipelinerunsTabPO.drawerPanel)
      .contains(pipelinerunsTabPO.listGroup, 'Vulnerabilities scan')
      .contains(vulnerabilities)
      .scrollIntoView()
      .should('be.visible');
  }

  static checkVulScanOnPipelinerunDetails(vulnerabilities: RegExp) {
    cy.contains(pipelinerunsTabPO.listGroup, 'Vulnerabilities scan')
      .contains(vulnerabilities)
      .scrollIntoView()
      .should('be.visible');
  }

  static clickOnVulScanViewLogs() {
    cy.contains(pipelinerunsTabPO.listGroup, 'Vulnerabilities scan').contains('View logs').click();
  }

  static clickOnDrawerPanelLogsTab() {
    cy.get(pipelinerunsTabPO.drawerPanel).contains('button', 'Logs').click();
  }

  static verifyLogs(logText: string | RegExp) {
    cy.get(pipelinerunsTabPO.logText)
      .contains(logText, { timeout: 80000 })
      .scrollIntoView()
      .should('be.visible');
  }

  static closeDrawerPanel() {
    cy.get(pipelinerunsTabPO.drawerClose).click().should('not.exist');
  }

  static checkDownloadSBOM() {
    cy.contains(pipelinerunsTabPO.listGroup, 'Download SBOM')
      .find('input')
      .should('contain.value', `cosign download sbom quay.io/`)
      .and('be.visible');
  }

  static downloadSBOMAndCheckUsingCosign() {
    cy.contains(pipelinerunsTabPO.listGroup, 'Download SBOM')
      .find('input')
      .invoke('val')
      .then((value) => {
        cy.exec(`${value}`).then((obj) => {
          expect(obj.code).to.equal(0);
          expect(JSON.parse(obj.stdout).components.length).to.greaterThan(0);
        });
      });
  }

  static waitForPLRAndDownloadAllLogs(allTaskLogs = true) {
    DetailsTab.waitUntilStatusIsNotRunning();
    LogsTab.downloadAllTaskLogs(allTaskLogs);
    UIhelper.verifyLabelAndValue('Status', 'Succeeded');
  }
}

export class TaskRunsTab {
  static goToTaskrunsTab() {
    UIhelper.clickTab('Task runs');
  }

  static getAdvancedTaskNamesList(pipelineName: string): taskRunDetailsRow[] {
    return [
      { name: `${pipelineName}-init`, task: 'init', status: 'Succeeded' },
      { name: `${pipelineName}-clone-repository`, task: 'clone-repository', status: 'Succeeded' },
      { name: `${pipelineName}-build-container`, task: 'build-container', status: 'Succeeded' },
      { name: `${pipelineName}-sast-snyk-check`, task: 'sast-snyk-check', status: 'Succeeded' },
      { name: `${pipelineName}-inspect-image`, task: 'inspect-image', status: 'Succeeded' },
      {
        name: `${pipelineName}-deprecated-base-image-check`,
        task: 'deprecated-base-image-check',
        status: 'Succeeded',
      },
      { name: `${pipelineName}-sbom-json-check`, task: 'sbom-json-check', status: 'Succeeded' },
      { name: `${pipelineName}-clair-scan`, task: 'clair-scan', status: 'Succeeded|Test Failures' }, // Adding Test Warnings as some packages might have medium vulnerabilities sometimes
      {
        name: `${pipelineName}-clamav-scan`,
        task: 'clamav-scan',
        status: 'Succeeded|Test Failures',
      },
      { name: `${pipelineName}-show-sbom`, task: 'show-sbom', status: 'Succeeded' },
      { name: `${pipelineName}-show-summary`, task: 'show-summary', status: 'Succeeded' },
    ];
  }
  static getbasicTaskNamesList(pipelineName: string): taskRunDetailsRow[] {
    return [
      { name: `${pipelineName}-init`, task: 'init', status: 'Succeeded' },
      { name: `${pipelineName}-clone-repository`, task: 'clone-repository', status: 'Succeeded' },
      { name: `${pipelineName}-build-container`, task: 'build-container', status: 'Succeeded' },
      { name: `${pipelineName}-show-summary`, task: 'show-summary', status: 'Succeeded' },
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
    UIhelper.clickTab('Logs');
  }

  static downloadAllTaskLogs(allTaskLogs = true) {
    LogsTab.goToLogsTab();
    if (allTaskLogs) {
      cy.contains('button', pipelinerunsTabPO.downloadAllTaskLogsButton)
        .should('be.enabled')
        .click();
    } else {
      cy.contains('button', /^Download$/)
        .should('be.enabled')
        .click();
    }
    DetailsTab.goToDetailsTab();
  }
}
