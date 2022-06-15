export const addComponentPagePO = {
  samples: 'Start with a sample.',
  addComponent: '[data-test="add-component"]',
  enterSource: '[data-test="enter-source"]',
  gitOptions: 'Git options',
  gitReference: '[data-test="git-reference"]',
  contextDir: '[data-test="context-dir"]',
  next: '[data-test="submit-button"]',
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
  next: '[data-test="submit-button"]',
  createApplication: 'Create application',
};

export const ComponentsPagePO = {
  create: '[data-test="submit-button"]',
  createText: 'Create',
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
};

export const applicationDetailPagePO = {
  item: '.pf-c-description-list__text',
  componentBuildLog: '[data-testid="View Build Logs"]',
  componentSettings: '[data-testid="Component settings"]',
  detailsArrow: '[aria-label="Details"]',
  cpuRamLabel: 'CPU/Mem Requests',
  replicaLabel: 'Replicas',
};

export const componentsListPagePO = {
  addComponent: '[pf-c-button pf-m-primary]',
  applicationName: 'pf-c-title pf-m-4xl hacDev-page__heading',
  items: '[pf-c-data-list__item]',
};

export const buildLogModalContentPO = {
  closeButton: '[aria-label="Close"]',
};
