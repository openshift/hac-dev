import * as React from 'react';
import { render, configure } from '@testing-library/react';
import ReleasesListRow from '../ReleasesListRow';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

configure({ testIdAttribute: 'data-test' });

const mockRelease = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Release',
  metadata: {
    name: 'test-release',
    creationTimestamp: '2023-01-20T14:13:29Z',
  },
  spec: {
    releasePlan: 'test-plan',
    snapshot: 'test-snapshot',
  },
  status: {
    conditions: [
      {
        reason: 'Succeeded',
        status: 'True',
      },
    ],
  },
};

describe('ReleasesListRow', () => {
  it('should render release info', () => {
    const wrapper = render(
      <ReleasesListRow
        obj={mockRelease}
        columns={[]}
        customData={{ applicationName: 'test-app' }}
      />,
      {
        container: document.createElement('tr'),
      },
    );
    const cells = wrapper.container.getElementsByTagName('td');
    const status = wrapper.getAllByTestId('release-status');

    expect(cells[0].children[0].innerHTML).toBe(mockRelease.metadata.name);
    expect(cells[3].innerHTML).toBe('test-plan');
    expect(cells[4].innerHTML).toBe('test-snapshot');
    expect(status[0].innerHTML).toBe('Succeeded');
  });
});
