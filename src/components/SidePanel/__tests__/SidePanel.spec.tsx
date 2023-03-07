import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import SidePanel from '../SidePanel';
import SidePanelContext from '../SidePanelContext';

describe('SidePanel', () => {
  it('should should render nothing', () => {
    const setPropsFn = jest.fn();
    const result = render(<SidePanel />, {
      wrapper: ({ children }) => (
        <SidePanelContext.Provider value={{ setProps: setPropsFn, close: () => {} }}>
          {children}
        </SidePanelContext.Provider>
      ),
    });
    expect(result.container).toBeEmptyDOMElement();
  });

  it('should send props to context', () => {
    const setPropsFn = jest.fn();
    const onExpandFn = jest.fn();
    render(
      <SidePanel isExpanded isInline onExpand={onExpandFn}>
        test
      </SidePanel>,
      {
        wrapper: ({ children }) => (
          <SidePanelContext.Provider value={{ setProps: setPropsFn, close: () => {} }}>
            {children}
          </SidePanelContext.Provider>
        ),
      },
    );
    expect(setPropsFn).toBeCalledWith({
      isExpanded: true,
      isInline: true,
      children: 'test',
      onExpand: onExpandFn,
    });
  });

  it('should close on unmount', () => {
    const setPropsFn = jest.fn();
    const closeFn = jest.fn();
    const result = render(<SidePanel isExpanded>test</SidePanel>, {
      wrapper: ({ children }) => (
        <SidePanelContext.Provider value={{ setProps: setPropsFn, close: closeFn }}>
          {children}
        </SidePanelContext.Provider>
      ),
    });

    // unmount SidePanel
    result.rerender(null);

    expect(closeFn).toBeCalledTimes(1);
  });
});
