import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import { useK8sWatchResource } from '../../../dynamic-plugin-sdk';
import { PipelineRunLogs } from '../../../shared';
import { componentCRMock } from '../../ComponentListView/__data__/componentMock';
import { pipelineRunMock } from '../__data__/pipelineRunMocks';
import { BuildLogViewer } from '../BuildLogViewer';

jest.mock('../../../dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

describe('BuildLogViewer', () => {
  it('should show loading box if pipelineRuns are being fetched', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[], false]);
    render(<BuildLogViewer component={componentCRMock} />);
    expect(screen.getByTestId('loading-indicator')).not.toBeNull();
  });

  it('should show empty box if pipelineRuns not found', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[], true]);
    render(<BuildLogViewer component={componentCRMock} />);
    expect(screen.getByTestId('empty-message')).not.toBeNull();
    expect(screen.getByTestId('empty-message').innerHTML).toBe('No pipeline runs found');
  });

  it('should show component name', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    const wrapper = shallow(<BuildLogViewer component={componentCRMock} />);
    expect(wrapper.find('span').contains('basic-node-js')).toBe(true);
  });

  it('should render PipelineRunLogs', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    const wrapper = shallow(<BuildLogViewer component={componentCRMock} />);
    expect(wrapper.find(PipelineRunLogs).exists()).toBe(true);
  });
});
