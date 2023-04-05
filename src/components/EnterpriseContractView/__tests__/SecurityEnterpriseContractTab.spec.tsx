import * as React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import { mockEnterpriseContractUIData } from '../__data__/mockEnterpriseContractLogsJson';
import { SecurityEnterpriseContractTab } from '../SecurityEnterpriseContractTab';
import { useEnterpriseContractResults } from '../useEnterpriseContractResultFromLogs';
import '@testing-library/jest-dom';

jest.mock('../useEnterpriseContractResultFromLogs', () => ({
  useEnterpriseContractResults: jest.fn(),
}));

const mockUseEnterpriseContractResults = useEnterpriseContractResults as jest.Mock;

describe('SecurityEnterpriseContractTab', () => {
  beforeEach(() => {
    mockUseEnterpriseContractResults.mockReturnValue([mockEnterpriseContractUIData, true]);
  });

  afterEach(() => {});

  it('should render component security tab', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    screen.getByText('Missing CVE scan results');
  });

  it('should filter out results based on the name input field', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    screen.getByText('Missing CVE scan results');
    fireEvent.input(screen.getByPlaceholderText('Search...'), { target: { value: 'No tasks' } });
    expect(screen.queryByText('Missing CVE scan results')).not.toBeInTheDocument();
    fireEvent.input(screen.getByPlaceholderText('Search...'), { target: { value: '' } });
    screen.getByText('Missing CVE scan results');
  });

  it('should filter out based on the status dropdown', async () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy-1" />);
    screen.getByText('Missing CVE scan results');
    fireEvent.click(screen.getByRole('button', { name: 'Status filter menu' }));
    fireEvent.click(screen.getByLabelText('Success'));
    expect(screen.queryByText('Missing CVE scan results')).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Clear all filters')[0]);
    screen.getByText('Missing CVE scan results');
  });

  it('should show empty state when no search result found', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy-1" />);
    screen.debug(undefined, 200000);
    screen.getByText('Missing CVE scan results');
    fireEvent.click(screen.getByRole('button', { name: 'Status filter menu' }));
    fireEvent.click(screen.getByLabelText('Failed'));
    screen.getByText('Missing CVE scan results');
    fireEvent.input(screen.getByPlaceholderText('Search...'), { target: { value: 'No tasks' } });
    expect(screen.queryByText('Missing CVE scan results')).not.toBeInTheDocument();
    screen.getByText('No results found');
    fireEvent.click(screen.getAllByText('Clear all filters')[1]);
    screen.getByText('Missing CVE scan results');
  });
});
