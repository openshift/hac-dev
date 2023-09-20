import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useReleaseStrategies } from '../../../../hooks/useReleaseStrategies';
import { mockReleaseStrategy } from '../__data__/release-strategy.mock';
import ReleaseStrategyListView from '../ReleaseStrategyListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(() => ['']),
}));

jest.mock('../../../../hooks/useReleaseStrategies', () => ({
  useReleaseStrategies: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'abcd' })),
}));

const mockReleaseStrategyHook = useReleaseStrategies as jest.Mock;

describe('ReleaseStrategyListView', () => {
  it('should render progress bar while loading', async () => {
    mockReleaseStrategyHook.mockReturnValue([[], false]);
    const wrapper = render(<ReleaseStrategyListView />);
    expect(await wrapper.findByRole('progressbar')).toBeTruthy();
  });

  it('should render empty state when no release strategy present', () => {
    mockReleaseStrategyHook.mockReturnValue([[], true]);
    const wrapper = render(<ReleaseStrategyListView />);
    expect(wrapper.findByText('No Release Strategy found')).toBeTruthy();
  });

  it('should render table view for release strategy', async () => {
    mockReleaseStrategyHook.mockReturnValue([[mockReleaseStrategy], true]);
    const wrapper = render(<ReleaseStrategyListView />);
    await waitFor(() => expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1));
  });

  it('should render filter toolbar', async () => {
    mockReleaseStrategyHook.mockReturnValue([[mockReleaseStrategy], true]);
    const wrapper = render(<ReleaseStrategyListView />);
    await waitFor(() => wrapper.getByTestId('release-strategy-list-toolbar'));
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
    expect(wrapper.container.getElementsByTagName('tr')).toHaveLength(1);
  });
});
