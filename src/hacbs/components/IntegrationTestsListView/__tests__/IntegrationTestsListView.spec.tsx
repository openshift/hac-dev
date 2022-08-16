import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure } from '@testing-library/react';
import { routerRenderer } from '../../../../utils/test-utils';
import { MockIntegrationTests } from '../__data__/mock-integration-tests';
import IntegrationTestsListView from '../IntegrationTestsListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('IntegrationTestsListView', () => {
  it('should render the skeleton table if integration tests data is not loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    const wrapper = routerRenderer(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.findByText('No integration test pipelines found yet.')).toBeTruthy();
  });

  it('should render the empty state if there are no integration tests', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    const wrapper = routerRenderer(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.findByText('No integration test pipelines found yet.')).toBeTruthy();
  });

  it('should render a table when there are integration tests', () => {
    useK8sWatchResourceMock.mockReturnValue([MockIntegrationTests, true, undefined]);
    const wrapper = routerRenderer(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
  });
});
