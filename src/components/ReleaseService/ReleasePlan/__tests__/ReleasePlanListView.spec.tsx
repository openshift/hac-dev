import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useReleasePlans } from '../../../../hooks/useReleasePlans';
import { mockReleasePlan } from '../__data__/release-plan.mock';
import ReleasePlanListView from '../ReleasePlanListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(() => ['']),
}));

jest.mock('../../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'abcd' })),
}));

const mockReleasePlanHook = useReleasePlans as jest.Mock;

describe('ReleasePlanListView', () => {
  it('should render progress bar while loading', async () => {
    mockReleasePlanHook.mockReturnValue([[], false]);
    const wrapper = render(<ReleasePlanListView />);
    expect(await wrapper.findByRole('progressbar')).toBeTruthy();
  });

  it('should render empty state when no release Plans present', () => {
    mockReleasePlanHook.mockReturnValue([[], true]);
    const wrapper = render(<ReleasePlanListView />);
    expect(wrapper.findByText('No Release Plan found')).toBeTruthy();
  });

  it('should render table view for release plans', async () => {
    mockReleasePlanHook.mockReturnValue([[mockReleasePlan], true]);
    const wrapper = render(<ReleasePlanListView />);
    await waitFor(() => expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1));
  });

  it('should render filter toolbar', async () => {
    mockReleasePlanHook.mockReturnValue([[mockReleasePlan], true]);
    const wrapper = render(<ReleasePlanListView />);
    await waitFor(() => wrapper.getByTestId('release-plan-list-toolbar'));
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
    expect(wrapper.container.getElementsByTagName('tr')).toHaveLength(1);
  });
});
