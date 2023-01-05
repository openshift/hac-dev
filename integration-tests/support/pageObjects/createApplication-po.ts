export const addComponentPagePO = {
  samples: 'Start with a sample.',
  addComponent: '[data-test="add-component-button"]',
  enterSource: '[data-test="enter-source"]',
  gitOptions: 'Git options',
  gitReference: '[data-test="git-reference"]',
  contextDir: '[data-test="context-dir"]',
  next: 'button[type=submit]',
  toggleButton: '[data-test="{0}-toggle-button"]',
  username: '[data-testid="auth-username"]',
  token: '[data-testid="auth-token"]',
  authenticateButton: '[data-testid="authenticate-token"]',
  notValidatedMessage: 'Unable to access repository',
  useTokenButton: 'Use a token instead',
};

export const componentSamplesPagePO = {
  grid: '.catalog-page__grid',
  nodejs: '[data-test="sample-Basic Node.js"]',
  python: '[data-test="sample-Basic Python"]',
  quarkus: '[data-test="sample-Basic Quarkus"]',
  spring: '[data-test="sample-Basic Spring Boot"]',
  create: '[data-test="submit-button"]',
};

export const createApplicationPagePO = {
  applicationName: '[id="form-input-application-field"]',
  next: 'button[type=submit]',
  createApplication: 'Create application',
};

export const ComponentsPagePO = {
  create: 'button[type=submit]',
  createText: 'Create',
  editComponentNameIcon: '[data-test="pencil-icon"]',
  checkIcon: '[data-test="check-icon"]',
  closeIcon: '[data-test="close-icon"]',
  showAdvancedSetting: 'Show advanced deployment options',
  cpuInput: 'input[name*="cpuValue"]',
  cpuPlusButton: 'button[data-ouia-component-id="OUIA-Generated-Button-control-2"]',
  cpuMinusButton: 'button[data-ouia-component-id="OUIA-Generated-Button-control-1"]',
  memoryInput: 'input[name*="memoryValue"]',
  dropdown: 'button[data-test="dropdown-toggle"]',
  replicaInput: 'input[id*="replicas-field"]',
  nameInput: '[data-test="pairs-list-name"][value=""]',
  valueInput: '[data-test="pairs-list-value"][value=""]',
  addEnvVar: '[data-test="add-button"]',
  loading: '[data-test="loading-indicator"]',
  saveButton: '[data-test="submit-button"]',
  editNameInput: '[data-test="editable-label-input"]',
};

export const applicationDetailPagePO = {
  item: '[data-testid="component-list-item-name"] > b',
  componentBuildLog: '[data-testid="view-build-logs"]',
  componentSettings: '[data-testid="Component settings"]',
  detailsArrow: '[aria-label="Details"]',
  cpuRamLabel: 'CPU/Mem Requests',
  replicaLabel: 'Instances',
};

export const componentsListPagePO = {
  addComponent: '[pf-c-button pf-m-primary]',
  applicationName: 'pf-c-title pf-m-4xl hacDev-page__heading',
  items: '[pf-c-data-list__item]',
};

export const buildLogModalContentPO = {
  closeButton: '[aria-label="Close"]',
};
