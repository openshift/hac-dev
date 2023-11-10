import * as React from 'react';
import '@testing-library/jest-dom';
import { TopologyView } from '@patternfly/react-topology';
import { render, waitFor, screen } from '@testing-library/react';
import { pipelineRunComponentFactory } from '../../../PipelineRunDetailsView/factories';
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
        componentFactory={pipelineRunComponentFactory}
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
    const mockControlBar = () => jest.fn() as any;
    render(
      <VisualizationFactory
        model={{ graph: { id: 'g1', type: 'graph' } }}
        layoutFactory={layoutFactory}
        componentFactory={pipelineRunComponentFactory}
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

  it('should contain a wrapper around the visualization', async () => {
    const mockControlBar = () => jest.fn() as any;
    render(
      <VisualizationFactory
        model={{ graph: { id: 'g1', type: 'graph' } }}
        layoutFactory={layoutFactory}
        componentFactory={pipelineRunComponentFactory}
        controlBar={mockControlBar}
      />,
    );
    screen.getByTestId('visualization-wrapper');
  });

  it('should not contain a wrapper around the visualization if fullHeight prop is set', async () => {
    const mockControlBar = () => jest.fn() as any;
    render(
      <VisualizationFactory
        model={{ graph: { id: 'g1', type: 'graph' } }}
        layoutFactory={layoutFactory}
        componentFactory={pipelineRunComponentFactory}
        controlBar={mockControlBar}
        fullHeight
      />,
    );
    expect(screen.queryByTestId('visualization-wrapper')).not.toBeInTheDocument();
  });
});
