import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import { PipelineRunLabel, PipelineRunType } from '../../../consts/pipelinerun';
import { PipelineRunLogs } from '../../../shared';
import { componentCRMocks } from '../../ApplicationDetailsView/__data__/mock-data';
import { pipelineRunMock } from '../__data__/pipelineRunMocks';
import { BuildLogViewer } from '../BuildLogViewer';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

describe('BuildLogViewer', () => {
  it('should show loading box if pipelineRuns are being fetched', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[], false]);
    render(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('loading-indicator')).not.toBeNull();
  });

  it('should show empty box if pipelineRuns not found', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[], true]);
    render(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('empty-message')).not.toBeNull();
    expect(screen.getByTestId('empty-message').innerHTML).toBe('No pipeline runs found');
  });

  it('should show component name', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    const wrapper = shallow(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(wrapper.find('span').contains('basic-node-js')).toBe(true);
  });

  it('should render PipelineRunLogs', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    const wrapper = shallow(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(wrapper.find(PipelineRunLogs).exists()).toBe(true);
  });

  it('should show empty box if it is not a build pipelinerun', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    const pipelineruns = [
      {
        ...pipelineRunMock,
        metadata: {
          ...pipelineRunMock.metadata,
          labels: {
            ...pipelineRunMock.metadata.labels,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
          },
        },
      },
    ];
    watchResourceMock.mockReturnValue([
      pipelineruns.filter(
        (p) => p.metadata.labels[PipelineRunLabel.PIPELINE_TYPE] === PipelineRunType.BUILD,
      ),
      true,
    ]);

    render(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('empty-message')).not.toBeNull();
    expect(screen.getByTestId('empty-message').innerHTML).toBe('No pipeline runs found');
  });
});
