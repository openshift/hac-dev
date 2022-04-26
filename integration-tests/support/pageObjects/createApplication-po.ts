export const addComponentPagePO = {
  samples: 'Start with a sample.',
  addComponent: '[data-testid="add-component"]',
};

export const componentSamplesPagePO = {
  grid: '.co-catalog-page__grid',
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

export const applicationComponentsPagePO = {
  create: '[data-test="submit-button"]',
  createText: 'Create',
  componentPreferences: '[data-testid="kebab-button"]',
  componentDelete: '[data-testid="Delete"]',
  item: '.pf-c-description-list__text',
};

export const componentsListPagePO = {
  addComponent: '[pf-c-button pf-m-primary]',
  applicationName: 'pf-c-title pf-m-4xl hacDev-page__heading',
  items: '[pf-c-data-list__item]',
};
