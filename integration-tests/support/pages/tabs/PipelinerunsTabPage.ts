import { pipelinerunsTabPO } from "../../pageObjects/pages-po";

// Pipelineruns List view page
export class PipelinerunsTabPage {
    public pipelineRunList: string[] = ["defaultName"];

    static clickOnPipelinerunFromListView(pipelinerun: string) {
        cy.contains('a', pipelinerun).click();
    }

    static doesPipelinerunExistsInListView(pipelinerun: string) {
        cy.contains(pipelinerun, { timeout: 5000 });
    }

    static checkPipelinerunStatus(isAdvancedFlowActive: boolean = false) {
        DetailsTab.checkStatusSucceeded(isAdvancedFlowActive);
    }
}

// Pipelineruns Details view page
export class DetailsTab {
    static goToDetailsTab() {
        cy.get(pipelinerunsTabPO.clickDetailsTab).click();
    }

    static checkStatusSucceeded(isAdvancedFlowActive: boolean = false) {
        cy.get(pipelinerunsTabPO.statusPO, { timeout: 50000 }).invoke('text').then(text => {
            if (text.includes('Running')) {
                cy.get(pipelinerunsTabPO.statusPO, { timeout: 1000000 }).should('not.have.text', 'Running');
            }
        });

        cy.get(pipelinerunsTabPO.statusPO).invoke('text').then(text => {
            if (text.includes('Succeeded')) {
                TaskRunsTab.goToTaskRunsTab().assertTaskNamesAndTaskRunStatus(isAdvancedFlowActive);
            }
            else if (text.includes('Failed')) {
                LogsTab.goToLogsTab();
                LogsTab.downloadAllTaskLogs();
                cy.screenshot('capture-logs-on-pipelinerun-failure', { capture: 'fullPage' });
            }
        });
    }
}

export class TaskRunsTab {
    advancedTaskNameList: string[] = ['init', 'git-clone', 'configure-build', 'buildah', 'summary',
        'sast-snyk-check', 'deprecated-image-check', 'clamav-scan',
        'sbom-json-check', 'sanity-inspect-image', 'clair-scan',
        'sanity-label-check', 'sanity-label-check'];

    basicTaskNameList: string[] = ['init', 'git-clone', 'configure-build', 'buildah', 'summary'];

    static goToTaskRunsTab() {
        cy.get(pipelinerunsTabPO.clickTaskRunsTab).click();
        return new TaskRunsTab();
    }

    assertTaskNamesAndTaskRunStatus(isAdvancedFlowActive: boolean = false) {
        for (let i = 0; i < ((isAdvancedFlowActive) ? this.advancedTaskNameList.length : this.basicTaskNameList.length); i++) {
            cy.get(`[data-test="${i}-0"] > td`).eq(1).then((taskName) => {
                if (isAdvancedFlowActive) {
                    expect(this.advancedTaskNameList.includes(taskName.text().trim())).to.equal(true);
                }
                else {
                    expect(this.basicTaskNameList.includes(taskName.text().trim())).to.equal(true);
                }
            });

            cy.get(`[data-test="${i}-0"] > td`).eq(3).within(() => {
                cy.get(pipelinerunsTabPO.taskRunStatus).invoke('text').then(status => {
                    expect(status.includes("Succeeded")).to.equal(true);
                })
            });
        }
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
