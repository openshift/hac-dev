const DEFAULT_SELECTOR = '#hacDev-modal-container';

export const getModalContainer = (selector?: string): HTMLElement => {
  return selector ? document.querySelector(selector) : document.querySelector(DEFAULT_SELECTOR);
};
