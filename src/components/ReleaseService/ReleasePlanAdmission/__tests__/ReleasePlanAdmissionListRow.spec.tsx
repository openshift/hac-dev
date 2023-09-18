import * as React from 'react';
import { render } from '@testing-library/react';
import { mockReleasePlanAdmission } from '../__data__/release-plan-admission.mock';
import ReleasePlanAdmissionListRow from '../ReleasePlanAdmissionListRow';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

describe('ReleasePlanListRow', () => {
  it('should render release plan data into table cells', () => {
    const wrapper = render(
      <ReleasePlanAdmissionListRow obj={mockReleasePlanAdmission} columns={[]} />,
      {
        container: document.createElement('tr'),
      },
    );
    const cells = wrapper.container.getElementsByTagName('td');

    expect(cells[0].innerHTML).toBe(mockReleasePlanAdmission.metadata.name);
    expect(cells[1].innerHTML).toBe('my-app-1');
    expect(cells[2].innerHTML).toBe('sbudhwar-1-tenant');
    expect(cells[3].innerHTML).toBe('test-rs');
    expect(cells[4].innerHTML).toBe('True');
  });
});
