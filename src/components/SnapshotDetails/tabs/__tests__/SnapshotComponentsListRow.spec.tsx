import * as React from 'react';
import { screen, render, configure } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockComponentsData } from '../../../ApplicationDetails/__data__';
import SnapshotComponentsListRow, {
  SnapshotComponentTableData,
} from '../SnapshotComponentsListRow';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

configure({ testIdAttribute: 'data-test-id' });

const rowData: SnapshotComponentTableData = {
  metadata: { uid: mockComponentsData[1].metadata.uid, name: mockComponentsData[1].metadata.name },
  name: mockComponentsData[1].metadata.name,
  containerImage: mockComponentsData[1].spec.containerImage,
  application: 'test-app',
  source: { git: { url: mockComponentsData[1].spec.source.git.url, revision: 'main' } },
};

describe('SnapshotComponentsListRow', () => {
  it('should list correct Component ', () => {
    const { queryByText } = render(<SnapshotComponentsListRow columns={null} obj={rowData} />);
    expect(queryByText('test-go')).toBeInTheDocument();
  });

  it('should list Git URL as a link ', () => {
    render(<SnapshotComponentsListRow columns={null} obj={rowData} />);
    const githubLink = screen.queryByTestId('snapshot-component-git-url');
    expect(githubLink.getAttribute('href')).toBe(
      'https://github.com/test-user-1/devfile-sample-go-basic',
    );
  });
});
