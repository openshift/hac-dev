import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import ReleaseDetailsView from '../ReleaseDetailsView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: jest.fn(),
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('ReleaseDetailsView', () => {
  it('should render spinner if release data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    routerRenderer(<ReleaseDetailsView applicationName="my-app" releaseName="test-release" />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should render the error state if the release is not found', () => {
    watchResourceMock.mockReturnValue([[], false, { code: 404 }]);
    routerRenderer(<ReleaseDetailsView applicationName="my-app" releaseName="test-release" />);
    expect(screen.getByText('404: Page not found')).toBeVisible();
    expect(screen.getByText('Go to applications list')).toBeVisible();
  });

  it('should render release name if release data is loaded', () => {
    const mockRelease = {
      metadata: {
        name: 'test-release',
      },
      spec: {
        releasePlan: 'test-releaseplan',
        snapshot: 'test-snapshot',
      },
    };
    watchResourceMock.mockReturnValueOnce([mockRelease, true]).mockReturnValue([[], true]);
    routerRenderer(<ReleaseDetailsView applicationName="my-app" releaseName="test-release" />);
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent('test-release');
  });
});
