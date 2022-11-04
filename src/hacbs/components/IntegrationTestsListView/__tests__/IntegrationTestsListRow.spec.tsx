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

  it('should read the optional field from label', () => {
    const optionalIntegrationTest = MockIntegrationTests[0];
    const wrapper = render(<IntegrationTestListRow obj={optionalIntegrationTest} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');
    expect(cells[2].innerHTML).toBe('Optional');
  });

  it('should show mandatory value if the optional labels are not set', () => {
    const mandatoryIntegrationTest = MockIntegrationTests[1];
    const wrapper = render(<IntegrationTestListRow obj={mandatoryIntegrationTest} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');
    expect(cells[2].innerHTML).toBe('Mandatory');
  });
});
