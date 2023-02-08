import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { routerRenderer } from '../../utils/test-utils';
import EditIntegrationTestPage from '../EditIntegrationTestPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: () => jest.fn(),
    useParams: jest.fn(),
  };
});

jest.mock('../../components/NamespacedPage/NamespacedPage', () => ({
  useNamespace: jest.fn(() => 'test'),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useParamsMock = useParams as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('EditIntegrationTestPage', () => {
  it('should show error state if test cannot be loaded', () => {
    useParamsMock.mockReturnValue({ name: 'int-test' });
    watchResourceMock.mockReturnValue([[], false, { message: 'Test does not exist', code: 404 }]);
    routerRenderer(<EditIntegrationTestPage />);
    screen.getByText('404: Page not found');
  });
});
