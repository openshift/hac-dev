import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, screen } from '@testing-library/react';
import { getQueryArgument } from '../../shared/utils';
import { useAccessReviewForModels } from '../../utils/rbac';
import { namespaceRenderer } from '../../utils/test-utils';
import ComponentSettingsPage from '../ComponentSettingsPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
  useAccessReviewForModels: jest.fn(),
}));

jest.mock('../../shared/utils', () => ({
  getQueryArgument: jest.fn(),
}));

jest.mock('../../components/ComponentSettingsForm/ComponentSettingsView', () => () => {
  return <div data-test="components-settings-view" />;
});

const accessReviewMock = useAccessReviewForModels as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const getQueryArgumentMock = getQueryArgument as jest.Mock;
const useParamsMock = useParams as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('ComponentSettingsPage', () => {
  let navigateMock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({ appName: 'my-app' });
    getQueryArgumentMock.mockReturnValue({ componentName: 'my-commit' });
    accessReviewMock.mockReturnValue([true, true]);
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<ComponentSettingsPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByTestId('spinner');
  });

  it('should render page not found component when some required params are missing', () => {
    getQueryArgumentMock.mockReturnValue(null);

    accessReviewMock.mockReturnValue([true, true]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<ComponentSettingsPage />, 'test-ns', { workspacesLoaded: true });
    fireEvent.click(screen.getByRole('button', { name: 'Go back' }));

    expect(navigateMock).toHaveBeenCalled();
    screen.getByText('No component specified');
  });

  it('should render components settings page', () => {
    accessReviewMock.mockReturnValue([true, true]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<ComponentSettingsPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByTestId('components-settings-view');
  });
});
