import * as React from 'react';
import { render } from '@testing-library/react';
import { mockReleasePlan } from '../__data__/release-plan.mock';
import ReleasePlanListRow from '../ReleasePlanListRow';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

describe('ReleasePlanListRow', () => {
  it('should render release plan data into table cells', () => {
    const wrapper = render(<ReleasePlanListRow obj={mockReleasePlan} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');

    expect(cells[0].innerHTML).toBe(mockReleasePlan.metadata.name);
    expect(cells[1].children[0].innerHTML).toBe('my-app-1');
    expect(cells[2].innerHTML).toBe('rorai-tenant');
    expect(cells[3].innerHTML).toBe('True');
    expect(cells[4].innerHTML).toBe('True');
  });
});
