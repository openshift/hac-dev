import * as React from 'react';
import '@testing-library/jest-dom';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { screen, render, fireEvent, waitFor, act } from '@testing-library/react';
import { useRemoteSecrets } from '../../../hooks/UseRemoteSecrets';
import { RemoteSecretStatusReason } from '../../../types';
import SecretsListRow from '../SecretsListView/SecretsListRow';
import SecretsListView from '../SecretsListView/SecretsListView';
import { sampleRemoteSecrets } from './secret-data';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => (
      <a href={props.to} data-test={props['data-test']}>
        {props.children}
      </a>
    ),
    useNavigate: () => jest.fn(),
    useSearchParams: () => React.useState(() => new URLSearchParams()),
    useParams: jest.fn(),
  };
});

jest.mock('../../../hooks/UseRemoteSecrets', () => ({
  useRemoteSecrets: jest.fn(),
}));

jest.mock('../../../shared/components/table', () => {
  const actual = jest.requireActual('../../../shared/components/table');
  return {
    ...actual,
    Table: (props) => {
      const { data, filters, selected, match, kindObj } = props;
      const cProps = { data, filters, selected, match, kindObj };
      const columns = props.Header(cProps);
      return (
        <PfTable role="table" aria-label="table" cells={columns} variant="compact" borders={false}>
          <TableHeader role="rowgroup" />
          <tbody>
            {props.data.map((d, i) => (
              <tr key={i}>
                <SecretsListRow columns={null} obj={d} customData={props.customData} />
              </tr>
            ))}
          </tbody>
        </PfTable>
      );
    },
  };
});

const useRemoteSecretsMock = useRemoteSecrets as jest.Mock;
describe('Secrets List', () => {
  it('should render the loader if the secrets are not loaded', () => {
    useRemoteSecretsMock.mockReturnValue([[], false]);
    render(<SecretsListView />);

    screen.getByRole('progressbar');
  });

  it('should render the empty state if there are not remote secrets in the workspace', () => {
    useRemoteSecretsMock.mockReturnValue([[], true]);
    render(<SecretsListView />);

    expect(screen.queryByTestId('secrets-empty-state')).toBeInTheDocument();
  });

  it('should render all the remote secrets in the workspace', () => {
    useRemoteSecretsMock.mockReturnValue([
      [sampleRemoteSecrets[RemoteSecretStatusReason.AwaitingData]],
      true,
    ]);
    render(<SecretsListView />);

    expect(screen.queryByTestId('secrets-empty-state')).not.toBeInTheDocument();

    screen.getByText('test-secret-one');
    screen.getByText('AwaitingData');
    screen.getByText('Image pull');
  });

  it('should filter the remote secrets in the workspace', () => {
    useRemoteSecretsMock.mockReturnValue([
      [
        sampleRemoteSecrets[RemoteSecretStatusReason.AwaitingData],
        sampleRemoteSecrets[RemoteSecretStatusReason.Injected],
      ],
      true,
    ]);
    const r = render(<SecretsListView />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Search secrets');
    fireEvent.change(filter, {
      target: { value: 'test-secret-two' },
    });

    r.rerender(<SecretsListView />);

    expect(filter.value).toBe('test-secret-two');
    expect(screen.queryByText('test-secret-one')).not.toBeInTheDocument();

    screen.getByText('test-secret-two');
    screen.getByText('Injected');
    screen.getByText('Build');
    screen.getByText('Key/value (1)');
  });

  it('should remove the search filter string when clear button is clicked', async () => {
    useRemoteSecretsMock.mockReturnValue([
      [
        sampleRemoteSecrets[RemoteSecretStatusReason.AwaitingData],
        sampleRemoteSecrets[RemoteSecretStatusReason.Injected],
      ],
      true,
    ]);
    render(<SecretsListView />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Search secrets');
    await act(async () => {
      fireEvent.change(filter, {
        target: { value: 'test-secret-three' },
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));
    });

    waitFor(() => {
      expect(filter.value).toBe('');
    });
  });
});
