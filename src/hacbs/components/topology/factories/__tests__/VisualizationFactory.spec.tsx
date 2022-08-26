import * as React from 'react';
import { TopologyView } from '@patternfly/react-topology';
import { render, waitFor } from '@testing-library/react';
import { pipelineRuncomponentFactory } from '../../../PipelineRunDetailsView/factories';
import { layoutFactory } from '../layoutFactory';
import VisualizationFactory from '../VisualizationFactory';

jest.mock('@patternfly/react-topology', () => {
  const originalModule = jest.requireActual('@patternfly/react-topology');
  return {
    ...originalModule,
    TopologyView: jest.fn(() => <div>Topology View</div>),
  };
});
const topologyViewMock = TopologyView as jest.Mock;

describe('VisualizationFactory', () => {
  beforeEach(() => {
    topologyViewMock.mockClear();
  });

  it('should not pass controlBar to TopologyView', () => {
    render(
      <VisualizationFactory
        model={{ graph: { id: 'g1', type: 'graph' } }}
        layoutFactory={layoutFactory}
        componentFactory={pipelineRuncomponentFactory}
      />,
    );
    expect(topologyViewMock).toHaveBeenCalledTimes(1);
    expect(topologyViewMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        controlBar: undefined,
      }),
      {},
    );
  });

  it('should pass controlBar to TopologyView', async () => {
    const mockControlBar = () => jest.fn();
    render(
      <VisualizationFactory
        model={{ graph: { id: 'g1', type: 'graph' } }}
        layoutFactory={layoutFactory}
        componentFactory={pipelineRuncomponentFactory}
        controlBar={mockControlBar}
      />,
    );
    await waitFor(() => {
      expect(topologyViewMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          controlBar: expect.any(Function),
        }),
        {},
      );
    });
  });
});
