export const formPO = {
  create: '[data-test-id="submit-button"]',
  cancel: '[data-test-id="reset-button"]',
};
export const alert = '.pf-c-alert';
export const alertTitle = '.pf-c-alert__title';

export const consentButton = '[id="truste-consent-button"]';

export const loginPO = {
  usernameForm: '.pf-c-login__main',
  username: '#rh-username-verification-form',
  nextButton: '#login-show-step2',
  passwordForm: '#login-show-step2',
  password: '#rh-password-verification-form',
  loginButton: '#rh-password-verification-submit-button',
};

export const kcLoginPO = {
  username: '#username',
  password: '#password',
  loginButton: '#kc-login',
};

export const waits = {
  loader: '.loader',
  spinner: '.pf-c-spinner',
  gridPlaceholder: '.skeleton-catalog--tile',
  tablePlaceholder: '.loading-skeleton--table',
  viewPlaceholder: '[data-test="skeleton-detail-view"]',
  linkPlaceholder: '.pf-c-skeleton',
};

export const actions = {
  kebabButton: '[data-testid="kebab-button"]',
  deleteItem: '[data-testid="Delete"]',
  deleteModalInput: 'input[name*="resourceName"]',
  deleteModalButton: 'button[data-testid="delete-resource"]',
  editItem: '[data-testid="Edit"]',
};

export const navigation = {
  sideNavigation: '[data-ouia-component-id="SideNavigation"]',
};

export const breadcrumb = {
  breadcrumbLink: (param: string) => `[data-test-id="breadcrumb-link-${param}"]`
}
