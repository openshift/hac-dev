import * as React from 'react';
import { render } from '@testing-library/react';
import { testTaskRun } from '../__data__/mock-TaskRun-data';
import TaskRunListRow from '../TaskRunListRow';

describe('TaskRunListRow', () => {
  it('should render task info', () => {
    const wrapper = render(<TaskRunListRow obj={testTaskRun} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');

    expect(cells[0].innerHTML).toBe(testTaskRun.metadata.name);
    expect(cells[1].innerHTML).toBe(testTaskRun.spec.taskRef.name);
    expect(cells[3].innerHTML).toBe('Failed');
  });
});
