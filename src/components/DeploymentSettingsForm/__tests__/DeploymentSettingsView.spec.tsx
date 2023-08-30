import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { useRemoteSecrets } from '../../../hooks/UseRemoteSecrets';
import { componentCRMocks, mockApplication } from '../../ApplicationDetails/__data__/mock-data';
import DeploymentSettingsView from '../DeploymentSettingsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: jest.fn(),
  useParams: jest.fn(() => ({
    appName: 'test-app',
  })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

jest.mock('../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
  Shadows: () => null,
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../hooks/UseRemoteSecrets', () => ({
  useRemoteSecrets: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useApplicationsMock = useApplications as jest.Mock;
const useRemoteSecretsMock = useRemoteSecrets as jest.Mock;

describe('DeploymentSettingsView', () => {
  beforeEach(() => {
    useApplicationsMock.mockReturnValue([[mockApplication], true]);
    useRemoteSecretsMock.mockReturnValue([[], true]);
  });
  it('should render spinner if component data is not loaded', () => {
    watchResourceMock.mockReturnValue([{}, false]);
    render(<DeploymentSettingsView componentName="test" />);
    screen.getByRole('progressbar');
  });

  it('should render deployment settings form if component data is loaded', () => {
    watchResourceMock.mockReturnValue([componentCRMocks[1], true]);
    render(<DeploymentSettingsView componentName="nodejs" />);
    screen.getAllByText('Edit deployment settings');
  });

  it('should render error state for deployment settings form', () => {
    watchResourceMock.mockReturnValue([null, true, new Error('404 not found')]);
    render(<DeploymentSettingsView componentName="nodejs" />);
    screen.getAllByText('Unable to load component nodejs');
  });
});
