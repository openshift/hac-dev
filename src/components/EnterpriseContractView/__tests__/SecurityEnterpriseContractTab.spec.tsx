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

  it('should render empty state for security tab when pods are missing', () => {
    mockUseEnterpriseContractResults.mockReturnValue([undefined, true]);

    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    screen.getByTestId('security-tab-empty-state');
  });

  it('should render component security tab', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    screen.getByText('Missing CVE scan results');
  });

  it('should filter out results based on the name input field', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    screen.getByText('Missing CVE scan results');
    fireEvent.input(screen.getByPlaceholderText('Filter by rule...'), {
      target: { value: 'No tasks' },
    });
    expect(screen.queryByText('Missing CVE scan results')).not.toBeInTheDocument();
    fireEvent.input(screen.getByPlaceholderText('Filter by rule...'), { target: { value: '' } });
    screen.getByText('Missing CVE scan results');
  });

  it('should filter out based on the status dropdown', async () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    screen.getByText('Missing CVE scan results');
    fireEvent.click(screen.getByRole('button', { name: 'Status filter menu' }));
    fireEvent.click(screen.getByLabelText('Success'));
    expect(screen.queryByText('Missing CVE scan results')).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Clear all filters')[0]);
    screen.getByText('Missing CVE scan results');
  });

  it('should show empty state when no search result found', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    screen.getByText('Missing CVE scan results');
    fireEvent.click(screen.getByRole('button', { name: 'Status filter menu' }));
    fireEvent.click(screen.getByLabelText('Failed'));
    screen.getByText('Missing CVE scan results');
    fireEvent.input(screen.getByPlaceholderText('Filter by rule...'), {
      target: { value: 'No tasks' },
    });
    expect(screen.queryByText('Missing CVE scan results')).not.toBeInTheDocument();
    screen.getByText('No results found');
    fireEvent.click(screen.getAllByText('Clear all filters')[1]);
    screen.getByText('Missing CVE scan results');
  });

  it('should sort by Status', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    const status = screen.getAllByTestId('rule-status');
    expect(status[0].textContent.trim()).toEqual('Failed');
    fireEvent.click(screen.getAllByText('Status')[1]);
    const sortstatus = screen.getAllByTestId('rule-status');
    expect(sortstatus[0].textContent.trim()).toEqual('Success');
  });

  it('should render result summary', () => {
    routerRenderer(<SecurityEnterpriseContractTab pipelineRun="dummy" />);
    const resultSummary = screen.getByTestId('result-summary');
    const status = resultSummary.getElementsByTagName('span');
    expect(status[0].textContent.trim()).toBe('Failed');
    expect(status[1].textContent.trim()).toBe('Warning');
    expect(status[2].textContent.trim()).toBe('Success');
    const value = resultSummary.getElementsByTagName('b');
    expect(value[0].textContent).toBe('1');
    expect(value[1].textContent).toBe('0');
    expect(value[2].textContent).toBe('1');
  });
});
