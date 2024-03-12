import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import { IssueType } from '../AddIssueModal';
import { AddIssueSection } from '../AddIssueSection';

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

describe('AddIssueSection for Bugs', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show correct heading ', async () => {
    formikRenderer(<AddIssueSection field="bug" issueType={IssueType.BUG} />);
    expect(
      screen.getByText('Are there any bug fixes you would like to add to this release?'),
    ).toBeVisible();
  });

  it('should show correct columns ', async () => {
    formikRenderer(<AddIssueSection field="bug" issueType={IssueType.BUG} />);
    screen.getByText('Bug issue key');
    screen.getByText('URL');
    screen.getByText('Summary');
    screen.getByText('Last updated');
    screen.getByText('Status');
  });

  it('should render correct bug list ', async () => {
    formikRenderer(<AddIssueSection field="bugs" issueType={IssueType.BUG} />, {
      bugs: [
        { key: 'bug-nodejs', url: 'url1' },
        { key: 'bug-java', url: 'url2' },
        { key: 'bug-python', url: 'url3' },
      ],
    });
    expect(screen.getByText('bug-nodejs')).toBeInTheDocument();
    expect(screen.getByText('bug-java')).toBeInTheDocument();
    expect(screen.getByText('bug-python')).toBeInTheDocument();
  });

  it('should have no search filter onLoad ', async () => {
    formikRenderer(<AddIssueSection field="bugs" issueType={IssueType.BUG} />, {
      bugs: [
        { key: 'bug-nodejs', url: 'url1' },
        { key: 'bug-java', url: 'url2' },
        { key: 'bug-python', url: 'url3' },
      ],
    });
    const inputFilter = screen
      .getByTestId('bugs-input-filter')
      .querySelector('.pf-v5-c-text-input-group__text-input');
    expect((inputFilter as HTMLInputElement).value).toBe('');
  });

  it('should filter bug list ', async () => {
    formikRenderer(<AddIssueSection field="bugs" issueType={IssueType.BUG} />, {
      bugs: [
        { key: 'bug-nodejs', url: 'url1' },
        { key: 'bug-java', url: 'url2' },
        { key: 'bug-python', url: 'url3' },
      ],
    });
    const tableBody = screen.getByTestId('issue-table-body');
    expect(tableBody.children.length).toBe(3);
    const inputFilter = screen
      .getByTestId('bugs-input-filter')
      .querySelector('.pf-v5-c-text-input-group__text-input');

    fireEvent.change(inputFilter, { target: { value: 'java' } });
    await waitFor(() => {
      expect(tableBody.children.length).toBe(1);
      expect(tableBody.children[0].children[0].innerHTML).toBe('bug-java');
    });
  });

  it('should show emptyState ', async () => {
    formikRenderer(<AddIssueSection field="bugs" issueType={IssueType.BUG} />, {
      bugs: [],
    });
    expect(screen.getByText('No Bugs found'));
  });

  it('should show filteredEmptyState ', async () => {
    formikRenderer(<AddIssueSection field="bugs" issueType={IssueType.BUG} />, {
      bugs: [
        { key: 'bug-nodejs', url: 'url1' },
        { key: 'bug-java', url: 'url2' },
        { key: 'bug-python', url: 'url3' },
      ],
    });
    const inputFilter = screen
      .getByTestId('bugs-input-filter')
      .querySelector('.pf-v5-c-text-input-group__text-input');

    fireEvent.change(inputFilter, { target: { value: 'dotnet' } });
    await waitFor(() => {
      expect(
        screen.getByText('No results match this filter criteria. Clear all filters and try again.'),
      );
    });
  });

  it('should filter bug list ', async () => {
    formikRenderer(<AddIssueSection field="bugs" issueType={IssueType.BUG} />, {
      bugs: [
        { key: 'bug-nodejs', url: 'url1' },
        { key: 'bug-java', url: 'url2' },
        { key: 'bug-python', url: 'url3' },
      ],
    });
    const tableBody = screen.getByTestId('issue-table-body');
    expect(tableBody.children.length).toBe(3);
    const inputFilter = screen
      .getByTestId('bugs-input-filter')
      .querySelector('.pf-v5-c-text-input-group__text-input');

    fireEvent.change(inputFilter, { target: { value: 'java' } });
    await waitFor(() => {
      expect(tableBody.children.length).toBe(1);
      expect(tableBody.children[0].children[0].innerHTML).toBe('bug-java');
    });
  });
});

describe('AddIssueSection for CVEs', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show correct heading ', async () => {
    formikRenderer(<AddIssueSection field="cve" issueType={IssueType.CVE} />);
    expect(
      screen.getByText('Are there any CVEs you would like to add to this release?'),
    ).toBeVisible();
  });

  it('should show correct columns ', async () => {
    formikRenderer(<AddIssueSection field="cve" issueType={IssueType.CVE} />);
    screen.getByText('CVE key');
    screen.getByText('URL');
    screen.getByText('Components');
    screen.getByText('Summary');
    screen.getByText('Last updated');
    screen.getByText('Status');
  });

  it('should render correct cve list ', async () => {
    formikRenderer(<AddIssueSection field="cves" issueType={IssueType.CVE} />, {
      cves: [
        { key: 'cve-nodejs', url: 'url1' },
        { key: 'cve-java', url: 'url2' },
        { key: 'cve-python', url: 'url3' },
      ],
    });
    expect(screen.getByText('cve-nodejs')).toBeInTheDocument();
    expect(screen.getByText('cve-java')).toBeInTheDocument();
    expect(screen.getByText('cve-python')).toBeInTheDocument();
  });

  it('should render - when data is missing', async () => {
    formikRenderer(<AddIssueSection field="cves" issueType={IssueType.CVE} />, {
      cves: [{ key: 'cve-nodejs', url: 'url1' }],
    });
    expect(screen.getByTestId('issue-summary').innerHTML).toBe('-');
    expect(screen.getByTestId('issue-status').innerHTML).toBe('-');
  });

  it('should filter cves list ', async () => {
    formikRenderer(<AddIssueSection field="cves" issueType={IssueType.CVE} />, {
      cves: [
        { key: 'cve-nodejs', url: 'url1' },
        { key: 'cve-java', url: 'url2' },
        { key: 'cve-python', url: 'url3' },
      ],
    });
    const tableBody = screen.getByTestId('issue-table-body');
    expect(tableBody.children.length).toBe(3);
    const inputFilter = screen
      .getByTestId('cves-input-filter')
      .querySelector('.pf-v5-c-text-input-group__text-input');

    fireEvent.change(inputFilter, { target: { value: 'java' } });
    await waitFor(() => {
      expect(tableBody.children.length).toBe(1);
      expect(tableBody.children[0].children[0].innerHTML).toBe('cve-java');
    });
  });
});
