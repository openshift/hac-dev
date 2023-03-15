import * as React from 'react';
import '@testing-library/jest-dom';
import { useVisualizationController, useVisualizationState } from '@patternfly/react-topology';
import { render } from '@testing-library/react';
import SidePanelContext from '../../SidePanel/SidePanelContext';
import PipelineRunSidePanel from '../PipelineRunSidePanel';
import { PipelineRunNodeType } from '../visualization/types';

jest.mock('@patternfly/react-topology', () => ({
  useVisualizationController: jest.fn(() => ({ getElementById: jest.fn() })),
  useVisualizationState: jest.fn(() => [[], jest.fn()]),
}));

const useVisualizationControllerMock = useVisualizationController as jest.Mock;
const useVisualizationStateMock = useVisualizationState as jest.Mock;

describe('PipelineRunSidePanel', () => {
  it('should render nothing by default', () => {
    const setPropsFn = jest.fn();

    render(<PipelineRunSidePanel />, {
      wrapper: ({ children }) => (
        <SidePanelContext.Provider value={{ setProps: setPropsFn, close: () => {} }}>
          {children}
        </SidePanelContext.Provider>
      ),
    });

    expect(setPropsFn).toHaveBeenCalledWith(
      expect.objectContaining({
        isExpanded: false,
        children: null,
      }),
    );
  });

  it('should render nothing if selection is not a task', () => {
    useVisualizationStateMock.mockImplementationOnce(() => [['testId'], jest.fn()]);
    useVisualizationControllerMock.mockImplementationOnce(() => ({
      getElementById: () => ({ getType: () => 'invalid-type' }),
    }));

    const setPropsFn = jest.fn();

    render(<PipelineRunSidePanel />, {
      wrapper: ({ children }) => (
        <SidePanelContext.Provider value={{ setProps: setPropsFn, close: () => {} }}>
          {children}
        </SidePanelContext.Provider>
      ),
    });

    expect(setPropsFn).toHaveBeenCalledWith(
      expect.objectContaining({
        isExpanded: false,
        children: null,
      }),
    );
  });

  it('should render panel for task selection', () => {
    const scrollIntoViewFn = jest.fn();
    const testNode = { getType: () => PipelineRunNodeType.TASK_NODE };
    useVisualizationStateMock.mockImplementationOnce(() => [['testId'], jest.fn()]);
    useVisualizationControllerMock.mockImplementationOnce(() => ({
      getElementById: () => testNode,
    }));

    const setPropsFn = jest.fn();

    render(<PipelineRunSidePanel scrollIntoView={scrollIntoViewFn} />, {
      wrapper: ({ children }) => (
        <SidePanelContext.Provider value={{ setProps: setPropsFn, close: () => {} }}>
          {children}
        </SidePanelContext.Provider>
      ),
    });

    expect(setPropsFn).toHaveBeenCalledWith(
      expect.objectContaining({
        isExpanded: true,
      }),
    );
    expect(scrollIntoViewFn).toHaveBeenCalledWith(testNode);
  });
});
