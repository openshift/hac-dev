import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useApplicationReleases } from '../../../hooks';
import { mockRelease } from '../__data__/mock-release-data';
import ReleasesListView from '../ReleasesListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(() => ['']),
}));

jest.mock('../../../hooks', () => ({
  useApplicationReleases: jest.fn(),
}));

const mockReleases = useApplicationReleases as jest.Mock;

describe('ReleasesListView', () => {
  it('should render progress indicator while loading', async () => {
    mockReleases.mockReturnValue([[], false]);
    const wrapper = render(<ReleasesListView applicationName="test-app" />);
    expect(await wrapper.findByRole('progressbar')).toBeTruthy();
  });

  it('should render empty state when no releases present', () => {
    mockReleases.mockReturnValue([[], true]);
    const wrapper = render(<ReleasesListView applicationName="test-app" />);
    expect(wrapper.findByText('No Releases found')).toBeTruthy();
  });

  it('should render table', () => {
    mockReleases.mockReturnValue([[mockRelease], true]);
    const wrapper = render(<ReleasesListView applicationName="test-app" />);
    const table = wrapper.container.getElementsByTagName('table');
    expect(table).toHaveLength(1);
  });

  it('should render filter toolbar', () => {
    mockReleases.mockReturnValue([[mockRelease], true]);
    const wrapper = render(<ReleasesListView applicationName="test-app" />);
    screen.getByTestId('release-list-toolbar');
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
    expect(wrapper.container.getElementsByTagName('tr')).toHaveLength(1);
  });
});
