import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import BuildSection from '../BuildSection';

jest.mock('../../../../components/NamespacedPage/NamespacedPage', () => ({
  useNamespace: jest.fn(() => 'test'),
}));
jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));
jest.mock('formik', () => ({
  useFormikContext: jest.fn(() => ({
    values: {
      applicationData: {
        metadata: {
          name: 'test-app',
          labels: {},
        },
      },
      source: 'http://foo.bar',
      components: [
        {
          componentStub: {
            componentName: 'nodejs',
            source: {
              git: {
                url: 'http://foo.bar',
              },
            },
          },
        },
      ],
    },
  })),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('BuildSection', () => {
  it('should render unmerged PR state PR button while waiting to load pipelines', async () => {
    // waiting for resources to load
    useK8sWatchResourceMock.mockImplementation(() => [[], false]);
    const wrapper = render(<BuildSection />);
    const mergeButton = await wrapper.findByTestId('merge-button');
    expect(mergeButton.getAttribute('aria-disabled')).toBe('false');
  });

  it('should render unmerged PR state PR button after no build pipelines found', async () => {
    // resources loaded, but no pipelines found
    useK8sWatchResourceMock.mockImplementation(() => [[], true]);
    const wrapper = render(<BuildSection />);
    const mergeButton = await wrapper.findByTestId('merge-button');
    expect(mergeButton.getAttribute('aria-disabled')).toBe('false');
  });

  it('should render merged PR state PR button', async () => {
    // mock 1 or more pipelines
    useK8sWatchResourceMock.mockImplementation(() => [
      [
        {
          metadata: {
            name: 'p1',
            labels: { [PipelineRunLabel.COMPONENT]: 'nodejs' },
          },
        },
        {
          metadata: {
            name: 'p2',
            labels: { [PipelineRunLabel.COMPONENT]: 'nodejs' },
          },
        },
      ],
      true,
    ]);
    const wrapper = render(<BuildSection />);
    const mergeButton = await wrapper.findByTestId('merge-button');
    expect(mergeButton.getAttribute('aria-disabled')).toBe('true');
  });
});
