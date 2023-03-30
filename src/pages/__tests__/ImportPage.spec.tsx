import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { getQueryArgument } from '../../shared/utils';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { useAccessReviewForModels } from '../../utils/rbac';
import { namespaceRenderer } from '../../utils/test-utils';
import ImportPage from '../ImportPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

jest.mock('../../utils/breadcrumb-utils', () => ({
  useApplicationBreadcrumbs: jest.fn(),
}));

jest.mock('../../shared/utils', () => ({
  getQueryArgument: jest.fn(),
}));

jest.mock('../../components/ImportForm/ImportForm', () => () => {
  return <div data-test="import-form" />;
});

const accessReviewMock = useAccessReviewForModels as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const getQueryArgumentMock = getQueryArgument as jest.Mock;
const useApplicationBreadcrumbsMock = useApplicationBreadcrumbs as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('ImportPage', () => {
  beforeEach(() => {
    useApplicationBreadcrumbsMock.mockReturnValue([]);
    getQueryArgumentMock.mockReturnValue({ application: 'my-app' });
    accessReviewMock.mockReturnValue([true, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<ImportPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByTestId('spinner');
  });

  it('should show Add Component title', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<ImportPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByText('Add component');
  });

  it('should show Create Application title', () => {
    getQueryArgumentMock.mockReturnValue(null);
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<ImportPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByText('Create application');
  });

  it('should render import form', () => {
    accessReviewMock.mockReturnValue([true, true]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<ImportPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByTestId('import-form');
  });
});
