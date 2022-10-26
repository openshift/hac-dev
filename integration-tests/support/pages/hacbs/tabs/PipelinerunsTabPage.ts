import { pipelinerunsTabPO } from '../../../pageObjects/hacbs-po';

export class PipelinerunsTabPage {
    static clickOnPipelinerunFromListView(pipelinerun: string) {
        cy.contains('a', pipelinerun).click();
    }

    static doesPipelinerunExistsInListView(pipelinerun: string) {
        cy.contains(pipelinerun);
    }
}

// Pipelineruns Details view page
export class DetailsTab {
    static goToDetailsTab() {
        cy.get(pipelinerunsTabPO.clickDetailsTab).click();
    }

    static checkStatusSucceeded() {
        cy.get(pipelinerunsTabPO.statusPO, { timeout: 720000 }).should('have.text', 'Succeeded');
    }
}

export class YAMLTab {
    static goToYAMLTab() {
        cy.get(pipelinerunsTabPO.clickYAMLTab).click();
    }
}

export class TaskRunsTab {
    static goToTaskRunsTab() {
        cy.get(pipelinerunsTabPO.clickTaskRunsTab).click();
    }
}

export class LogsTab {
    static goToLogsTab() {
        cy.get(pipelinerunsTabPO.clickLogsTab).click();
    }
}

export class EventsTab {
    static goToEventsTab() {
        cy.get(pipelinerunsTabPO.clickEventsTab).click();
    }
}

export class EnterpriseContractTab {
    static goToEnterpriseContractTab() {
        cy.get(pipelinerunsTabPO.clickEnterpriseContractTab).click();
    }
}
