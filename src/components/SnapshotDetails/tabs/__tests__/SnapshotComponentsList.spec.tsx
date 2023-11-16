import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, configure } from '@testing-library/react';
import { componentCRMocks } from '../../../Components/__data__/mock-data';
import SnapshotComponentsList from '../SnapshotComponentsList';

const mockComponents = componentCRMocks.reduce((acc, mock) => {
  acc.push({ ...mock, spec: { ...mock.spec, application: 'test-app' } });
  return acc;
}, []);

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => {
      const [params, setParams] = React.useState(() => new URLSearchParams());
      const setParamsCb = React.useCallback((newParams: URLSearchParams) => {
        setParams(newParams);
        window.location.search = `?${newParams.toString()}`;
      }, []);
      return [params, setParamsCb];
    },
    Link: (props) => <a href={props.to}>{props.children}</a>,
  };
});

jest.mock('../../../../utils/component-utils', () => {
  const actual = jest.requireActual('../../../utils/component-utils');
  return {
    ...actual,
    useURLForComponentPRs: jest.fn(),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

configure({ testIdAttribute: 'data-test' });

describe('SnapshotComponentsList', () => {
  it('should render correct columns and titles', () => {
    render(<SnapshotComponentsList applicationName="test-app" components={mockComponents} />);
    screen.getByText('Components');
    screen.getByText('Component builds that are included in this snapshot');
    screen.getByText('Name');
    screen.getByText('Container Image');
    screen.getByText('Git URL');
    screen.getByText('Revision');
  });

  it('should render component row', () => {
    render(<SnapshotComponentsList applicationName="test-app" components={mockComponents} />);
    screen.queryByText('nodejs');
    screen.queryByText('main');
    screen.queryByText('https://github.com/nodeshift-starters/devfile-sample.git');
  });

  it('should render multiple components', () => {
    render(<SnapshotComponentsList applicationName="test-app" components={mockComponents} />);
    screen.queryByText('nodejs');
    screen.queryByText('basic-node-js');
    screen.queryByText('https://github.com/nodeshift-starters/devfile-sample');
    screen.queryByText('main');
    screen.queryByText('https://github.com/nodeshift-starters/devfile-sample.git');
  });

  it('should render filter toolbar ', () => {
    render(<SnapshotComponentsList applicationName="test-app" components={mockComponents} />);
    expect(screen.getByTestId('component-list-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('name-input-filter')).toBeInTheDocument();
  });

  it('should filter components based on name', () => {
    render(<SnapshotComponentsList applicationName="test-app" components={mockComponents} />);
    const nameSearchInput = screen.getByTestId('name-input-filter');
    const searchInput = nameSearchInput.querySelector('.pf-v5-c-text-input-group__text-input');
    fireEvent.change(searchInput, { target: { value: 'node-' } });
    screen.queryByText('basic-node-js');
    screen.debug();
    expect(screen.queryByText('nodejs')).not.toBeInTheDocument();
  });

  it('should render emptystate', () => {
    render(<SnapshotComponentsList applicationName="test-app" components={mockComponents} />);
    expect(screen.getByTestId('component-list-toolbar')).toBeInTheDocument();
    const nameSearchInput = screen.getByTestId('name-input-filter');
    const searchInput = nameSearchInput.querySelector('.pf-v5-c-text-input-group__text-input');
    fireEvent.change(searchInput, { target: { value: 'not-found' } });
    expect(screen.queryByText('nodejs')).not.toBeInTheDocument();
    expect(screen.queryByText('basic-node-js')).not.toBeInTheDocument();
    screen.queryByText('No components found attached to this snapshot');
  });
});
