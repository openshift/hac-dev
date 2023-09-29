export const applicationsPagePO = {
  appStatus: '[class="pf-v5-c-label__content"]',
  formGroup: 'div[class="pf-v5-c-form__group"]',
  secretKey: 'input[label="Key"]',
  secretValue: 'textarea[id="value"]',
};

export const overviewTabPO = {
  clickTab: '[data-test="details__tabItem overview"]',
  goToComponents: '[data-test="go-to-components-tab"]',
  addComponent: '[data-test="add-component"] > a',
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

  statusPO: '[data-test="pipelinerun-details status"]',

  clickTaskRunsTab: '[data-test="details__tabItem taskruns"]',
  taskRunStatus: '[data-test="taskrun-status"]',

  downloadAllTaskLogsButton: 'Download all task logs',
  relatedPipelinePopup: 'div[class="pf-v5-c-popover__content"]',
  relatedPipelineCloseBtn: 'button[aria-label="Close"]',

  node: (nodeId) => `g[data-id="${nodeId}"]`,
  logText: '[class="logs__content"]',
  drawerPanel: 'div[class*="drawer__panel-main"]',
  drawerClose: 'div[class="pf-v5-c-drawer__close"]',
  listGroup: 'div[class$="list__group"]',
  PF5TableRow: '[data-ouia-component-type="PF5/TableRow"]',

  ecResultSummary: 'div[data-testid="result-summary"]',
  ecSecurityRulesTableRow: 'tr[data-ouia-component-type="PF5/TableRow"]:not([hidden])',
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
  accessValidationMsg: 'div[class="pf-v5-c-form__helper-text"]',
};

export const environmentsPagePO = {
  kubconfigTextArea: 'textarea[id="text-file-kubeconfig"]',
  kubeconfigValidationMsg: 'div[class="pf-v5-c-form__helper-text"]',
  envCard: '[data-ouia-component-type="PF5/Card"]',
  label: 'div[class*="list__group"]',
  kebabButton: 'button[data-testid="kebab-button"]',
  envDropdownDeleteBtn: 'li[data-testid="Delete"]',
  envDeleteBtn: 'button[data-testid="delete-resource"]',
  envCardConnectionLabel: 'div[class="pf-v5-c-card__title"] span[class="pf-v5-c-label__content"]',
};

export const getStartedPagePO = {
  createAppButton: '[data-test="create-application"]',
};
