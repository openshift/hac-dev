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
    formikRenderer(<SnapshotDropdown name="snapshot" />);
    expect(screen.getByText('Loading snapshots...')).toBeVisible();
  });

  it('should show dropdown if snapshots are loaded', async () => {
    useSnapshotsMock.mockReturnValue([
      [{ metadata: { name: 'snapshot1' } }, { metadata: { name: 'snapshot2' } }],
      true,
    ]);
    formikRenderer(<SnapshotDropdown name="snapshot" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByRole('menuitem', { name: 'snapshot1' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'snapshot2' })).toBeVisible();
  });

  it('should change the Snapshot dropdown value', async () => {
    useSnapshotsMock.mockReturnValue([
      [{ metadata: { name: 'snapshot1' } }, { metadata: { name: 'snapshot2' } }],
      true,
    ]);

    formikRenderer(<SnapshotDropdown name="snapshot" />, {
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
