import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

export const HELP_TOPICS = {
  applicationView: {
    appView: 'app-view',
  },
  sourceSection: {
    addComponent: 'add-component',
  },
  reviewSection: {
    createAppConfig: 'create-app-config',
  },
  workspaceSettings: {
    settings: 'settings',
  },
};

export const useChromeHelpTopicsApi = () => useChrome((chrome: any) => chrome.helpTopics);
