import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { componentCRMocks } from '../../ApplicationDetails/__data__/mock-data';
import ComponentSettingsView from '../ComponentSettingsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
  Shadows: () => null,
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('ComponentSettingsView', () => {
  it('should render spinner if component data is not loaded', () => {
    watchResourceMock.mockReturnValue([{}, false]);
    render(<ComponentSettingsView componentName="test" />);
    screen.getByRole('progressbar');
  });

  it('should render component settings form if component data is loaded', () => {
    watchResourceMock.mockReturnValue([componentCRMocks[1], true]);
    render(<ComponentSettingsView componentName="nodejs" />);
    screen.getAllByText('Component settings');
  });
});
