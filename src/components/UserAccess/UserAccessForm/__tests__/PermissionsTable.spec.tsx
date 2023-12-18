import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, render, cleanup } from '@testing-library/react';
import { PermissionsTable } from '../PermissionsTable';

describe('PermissionsTable', () => {
  it('should render permissions table', () => {
    render(<PermissionsTable role="contributor" />);
    const header = screen.getAllByRole('rowgroup')[0];
    expect(header).toHaveTextContent('Permissions for');
    expect(header).toHaveTextContent('Access type');
    const rows = screen.getAllByRole('rowgroup')[1];
    const compRow = rows.children[1];
    expect(compRow.children[0]).toHaveTextContent('Component');
    expect(compRow.children[1]).toHaveTextContent('Read');
    const appRow = rows.children[0];
    expect(appRow.children[0]).toHaveTextContent('Application');
    expect(appRow.children[1]).toHaveTextContent('Read');
  });

  it('should show correct permissions for given role', () => {
    render(<PermissionsTable role="maintainer" />);
    let rows = screen.getAllByRole('rowgroup')[1];
    let compRow = rows.children[1];
    expect(compRow.children[0]).toHaveTextContent('Component');
    expect(compRow.children[1]).toHaveTextContent('Update');
    let appRow = rows.children[0];
    expect(appRow.children[0]).toHaveTextContent('Application');
    expect(appRow.children[1]).toHaveTextContent('Update');
    cleanup();

    render(<PermissionsTable role="admin" />);
    rows = screen.getAllByRole('rowgroup')[1];
    compRow = rows.children[1];
    expect(compRow.children[0]).toHaveTextContent('Component');
    expect(compRow.children[1]).toHaveTextContent('Everything');
    appRow = rows.children[0];
    expect(appRow.children[0]).toHaveTextContent('Application');
    expect(appRow.children[1]).toHaveTextContent('Everything');
  });

  it('should correctly format multiple permissions', () => {
    render(<PermissionsTable role="maintainer" />);
    const rows = screen.getAllByRole('rowgroup')[1];
    const wsRow = rows.children[10];
    expect(wsRow.children[1]).toHaveTextContent('Update and Delete');
    const appRow = rows.children[0];
    expect(appRow.children[1]).toHaveTextContent('Create, Read and Update');
  });
});
