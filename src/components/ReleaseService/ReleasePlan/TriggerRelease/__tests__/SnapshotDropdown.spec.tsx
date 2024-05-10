import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { useSnapshots } from '../../../../../hooks/useSnapshots';
import { formikRenderer } from '../../../../../utils/test-utils';
import { SnapshotDropdown } from '../SnapshotDropdown';

jest.mock('../../../../../hooks/useSnapshots', () => ({
  useSnapshots: jest.fn(),
}));

const useSnapshotsMock = useSnapshots as jest.Mock;

describe('SnapshotDropdown', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show loading indicator if snapshot arent loaded', () => {
    useSnapshotsMock.mockReturnValue([[], false]);
    formikRenderer(<SnapshotDropdown applicationName="app" name="snapshot" />);
    expect(screen.getByText('Loading snapshots...')).toBeVisible();
  });

  it('should show dropdown if snapshots are loaded', async () => {
    useSnapshotsMock.mockReturnValue([
      [
        { metadata: { name: 'snapshot1' }, spec: { application: 'app' } },
        { metadata: { name: 'snapshot2' }, spec: { application: 'app' } },
      ],
      true,
    ]);
    formikRenderer(<SnapshotDropdown applicationName="app" name="snapshot" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByRole('menuitem', { name: 'snapshot1' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'snapshot2' })).toBeVisible();
  });

  it('should only show dropdowns related to the correct application', async () => {
    useSnapshotsMock.mockReturnValue([
      [
        { metadata: { name: 'snapshot1' }, spec: { application: 'app' } },
        { metadata: { name: 'snapshot2' }, spec: { application: 'app2' } },
      ],
      true,
    ]);
    formikRenderer(<SnapshotDropdown applicationName="app" name="snapshot" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByRole('menuitem', { name: 'snapshot1' })).toBeVisible();
    expect(screen.queryByRole('menuitem', { name: 'snapshot2' })).not.toBeInTheDocument();
  });

  it('should change the Snapshot dropdown value', async () => {
    useSnapshotsMock.mockReturnValue([
      [
        { metadata: { name: 'snapshot1' }, spec: { application: 'app' } },
        { metadata: { name: 'snapshot2' }, spec: { application: 'app' } },
      ],
      true,
    ]);

    formikRenderer(<SnapshotDropdown applicationName="app" name="snapshot" />, {
      targets: { application: 'app' },
    });
    expect(screen.queryByRole('button')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByLabelText('Select snapshot'));
      screen.getByText('rp2');
    });
    await act(async () => {
      fireEvent.click(screen.getByText('snapshot2'));
    });
    waitFor(() => {
      expect(screen.getByText('snapshot2'));
    });
  });
});
