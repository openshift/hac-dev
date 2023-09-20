import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useReleasePlanAdmissions } from '../../../../hooks/useReleasePlanAdmissions';
import { mockReleasePlanAdmission } from '../__data__/release-plan-admission.mock';
import ReleasePlanAdmissionListView from '../ReleasePlanAdmissionListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(() => ['']),
}));

jest.mock('../../../../hooks/useReleasePlanAdmissions', () => ({
  useReleasePlanAdmissions: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'abcd' })),
}));

const mockReleasePlanHook = useReleasePlanAdmissions as jest.Mock;

describe('ReleasePlanAdmissionListView', () => {
  it('should render progress bar while loading', async () => {
    mockReleasePlanHook.mockReturnValue([[], false]);
    const wrapper = render(<ReleasePlanAdmissionListView />);
    expect(await wrapper.findByRole('progressbar')).toBeTruthy();
  });

  it('should render empty state when no release Plans present', () => {
    mockReleasePlanHook.mockReturnValue([[], true]);
    const wrapper = render(<ReleasePlanAdmissionListView />);
    expect(wrapper.findByText('No Release Plan Admission found')).toBeTruthy();
  });

  it('should render table view for release plans', async () => {
    mockReleasePlanHook.mockReturnValue([[mockReleasePlanAdmission], true]);
    const wrapper = render(<ReleasePlanAdmissionListView />);
    await waitFor(() => expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1));
  });

  it('should render filter toolbar', async () => {
    mockReleasePlanHook.mockReturnValue([[mockReleasePlanAdmission], true]);
    const wrapper = render(<ReleasePlanAdmissionListView />);
    await waitFor(() => wrapper.getByTestId('release-plan-admission-list-toolbar'));
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
    expect(wrapper.container.getElementsByTagName('tr')).toHaveLength(1);
  });
});
