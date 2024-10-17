import * as React from 'react';
import { render, configure } from '@testing-library/react';
import { mockKonfluxWorkspaces } from '../__data__/mock-workspace-data';
import WorkspaceListRow from '../WorkspaceListRow';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

configure({ testIdAttribute: 'data-test' });

describe('WorkspaceListRow', () => {
  it('should list private workspaces', () => {
    const wrapper = render(<WorkspaceListRow obj={mockKonfluxWorkspaces[0]} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');
    expect(cells[0].innerHTML).toBe(mockKonfluxWorkspaces[0].status.space.name);
    expect(cells[1].innerHTML).toBe(mockKonfluxWorkspaces[0].status.owner.email);
    expect(cells[2].innerHTML).toBe(mockKonfluxWorkspaces[0].spec.visibility);
  });
  it('should list community workspaces', () => {
    const wrapper = render(<WorkspaceListRow obj={mockKonfluxWorkspaces[2]} columns={[]} />, {
      container: document.createElement('tr'),
    });
    const cells = wrapper.container.getElementsByTagName('td');

    expect(cells[0].innerHTML).toBe(mockKonfluxWorkspaces[2].status.space.name);
    expect(cells[1].innerHTML).toBe(mockKonfluxWorkspaces[2].status.owner.email);
    expect(cells[2].innerHTML).toBe(mockKonfluxWorkspaces[2].spec.visibility);
  });
});
