export const applicationsPagePO = {
  appStatus: '[class="pf-c-label__content"]',
};

export const overviewTabPO = {
  clickTab: '[data-test="details__tabItem overview"]',
  goToComponents: '[data-test="go-to-components-tab"]',
  addComponent: '[data-test="add-component"]',
};

export const activityTabPO = {
  clickTab: '[data-test="details__tabItem activity"]',
};

export const componentsTabPO = {
  clickTab: '[data-test="details__tabItem components"]',
  addComponent: '[data-test="add-component-button"]',
  componentListItem: (param: string) => `[data-test="${param}-component-list-item"]`,
};

export const latestCommitsTabPO = {
  clickTab: '[data-testid="activity__tabItem latest-commits"]',
};

export const pipelinerunsTabPO = {
  clickTab: '[data-testid="activity__tabItem pipelineruns"]',

  clickDetailsTab: '[data-test="details__tabItem detail"]',
  statusPO: '[data-test="pipelinerun-details status"]',

  clickTaskRunsTab: '[data-test="details__tabItem taskruns"]',
  taskRunStatus: '[data-test="taskrun-status"]',

  clickLogsTab: '[data-test="details__tabItem logs"]',
  downloadAllTaskLogsButton: 'Download all task logs',
  relatedPipelinePopup: 'div[class="pf-c-popover__content"]',
  relatedPipelineCloseBtn: 'button[aria-label="Close"]',
};

export const integrationTestsTabPO = {
  clickTab: '[data-test="details__tabItem integrationtests"]',
  filterInputField: '[data-test="name-input-filter"]',
  saveChangesButton: '[data-test="submit-button"]',
};

export const actionsDropdown = {
  dropdown: '[data-test="details__actions"]',
  itemAddComponent: '[data-test="add-component"]',
  itemAddEnvironment: '[data-test="add-environment"]',
  itemAddIntegrationTest: '[data-test="add-integration-tests"]',
  itemDeleteApplication: '[data-test="delete-application"]',
  itemLearningResources: '[data-test="learning-resources"]',
};

export const createBuildStepPO = {
  mergePRButton: '[data-testid="merge-button"]',
  next: 'button[type=submit]',
};

export const addIntegrationTestStepPO = {
  displayNameInput: '[data-test="display-name-input"]',
  optionalreleaseCheckbox: '[data-test="optional-release-checkbox"]',
};
