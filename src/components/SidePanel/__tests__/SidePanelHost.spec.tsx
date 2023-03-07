import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import SidePanel from '../SidePanel';
import SidePanelHost from '../SidePanelHost';

describe('SidePanelHost', () => {
  it('should render drawer expanded states', () => {
    const result = render(<SidePanel>test</SidePanel>, {
      wrapper: ({ children }) => <SidePanelHost>{children}</SidePanelHost>,
    });

    expect(result.queryByText('test')).not.toBeInTheDocument();

    result.rerender(<SidePanel isExpanded>test</SidePanel>);

    expect(result.queryByText('test')).toBeInTheDocument();
  });
});
