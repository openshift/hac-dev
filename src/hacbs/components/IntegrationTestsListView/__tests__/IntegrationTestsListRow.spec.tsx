import * as React from 'react';
import { render } from '@testing-library/react';
import { MockIntegrationTests } from '../__data__/mock-integration-tests';
import IntegrationTestListRow from '../IntegrationTestListRow';

describe('IntegrationTestListRow', () => {
  it('should render integration test info', () => {
    const integrationTest = MockIntegrationTests[0];
    const wrapper = render(<IntegrationTestListRow obj={integrationTest} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');

    expect(cells[0].innerHTML).toBe(integrationTest.metadata.name);
    expect(cells[1].innerHTML.includes(integrationTest.spec.bundle)).toBeTruthy();
    expect(cells[3].innerHTML).toBe(integrationTest.spec.pipeline);
  });
});
