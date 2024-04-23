import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import * as yup from 'yup';
import { useAccessReviewForModels } from '../../utils/rbac';
import { namespaceRenderer } from '../../utils/test-utils';
import TriggerReleasePlanPage from '../TriggerReleasePlanPage';

configure({ testIdAttribute: 'data-test' });

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const accessReviewMock = useAccessReviewForModels as jest.Mock;

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useParamsMock = useParams as jest.Mock;

jest.mock('../../utils/analytics', () => ({
  ...jest.requireActual<any>('../../utils/analytics'),
  useTrackEvent: () => jest.fn,
}));

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
  Link: (props: any) => <a href={props.to}>{props.children}</a>,
  useNavigate: jest.fn(() => navigateMock),
  useParams: jest.fn(),
}));

jest.mock('../../components/ReleaseService/ReleasePlan/TriggerRelease/form-utils', () => ({
  ...jest.requireActual<any>('../form-utils'),
  createRelease: jest.fn(),
  triggerReleaseFormSchema: yup.object(),
}));

jest.mock(
  '../../components/ReleaseService/ReleasePlan/TriggerRelease/TriggerReleaseFormPage',
  () => ({
    TriggerReleaseFormPage: () => <div data-test="trigger-release-form" />,
  }),
);

describe('TriggerReleasePlanPage', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({ name: 'my-release-plan' });
    accessReviewMock.mockReturnValue([true, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render not found page', () => {
    accessReviewMock.mockReturnValue([false, true]);
    watchResourceMock.mockReturnValue([{}, true]);

    namespaceRenderer(<TriggerReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
      workspacesLoaded: true,
    });
    expect(screen.getByText('404: Page not found')).toBeVisible();
  });

  it('should render spinner while not loaded', () => {
    accessReviewMock.mockReturnValue([false, false]);
    useParamsMock.mockReturnValue({ name: 'my-release-plan', appName: 'app1' });
    namespaceRenderer(<TriggerReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
      workspacesLoaded: true,
    });
    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  it('should render trigger release form when loaded', () => {
    accessReviewMock.mockReturnValue([true, true]);
    useParamsMock.mockReturnValue({ name: 'my-release-plan', appName: 'app1' });
    namespaceRenderer(<TriggerReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
      workspacesLoaded: true,
    });
    screen.debug();
    expect(screen.queryByTestId('trigger-release-form')).toBeInTheDocument();
  });
});
