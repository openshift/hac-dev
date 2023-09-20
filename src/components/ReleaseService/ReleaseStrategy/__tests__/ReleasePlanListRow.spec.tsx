import * as React from 'react';
import { render } from '@testing-library/react';
import { mockReleaseStrategy } from '../__data__/release-strategy.mock';
import ReleaseStrategyListRow from '../ReleaseStrategyListRow';

describe('ReleaseStrategyListRow', () => {
  it('should render release strategy data into table cells', () => {
    const wrapper = render(<ReleaseStrategyListRow obj={mockReleaseStrategy} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');

    expect(cells[0].innerHTML).toBe(mockReleaseStrategy.metadata.name);
    expect(cells[1].innerHTML).toBe(mockReleaseStrategy.spec.pipeline);
    expect(cells[2].innerHTML).toBe(mockReleaseStrategy.spec.policy);
    expect(cells[3].innerHTML).toBe(mockReleaseStrategy.spec.bundle);
  });
});
