import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { PACState } from '../../../hooks/usePACState';
import { useTRPipelineRuns } from '../../../hooks/useTektonResults';
import { ComponentGroupVersionKind, PipelineRunGroupVersionKind } from '../../../models';
import { componentCRMocks } from '../__data__/mock-data';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import ComponentListView from '../ComponentListView';

const mockComponents = componentCRMocks.reduce((acc, mock) => {
  acc.push({ ...mock, spec: { ...mock.spec, application: 'test-app' } });
  return acc;
}, []);

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../hooks/useTektonResults');

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
  };
});

let paramValues = {};
jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: (param: string) => {
    const set = (val) => {
      paramValues[param] = val;
    };
    const unset = () => (paramValues[param] = undefined);
    return [paramValues[param], set, unset];
  },
}));

jest.mock('../../../hooks/usePipelineRuns', () => ({
  ...(jest.requireActual('../../../hooks/usePipelineRuns') as any),
  useLatestBuildPipelineRunForComponent: () => [mockPipelineRuns[0], true],
}));

jest.mock('../../../utils/component-utils', () => {
  const actual = jest.requireActual('../../../utils/component-utils');
  return {
    ...actual,
    useURLForComponentPRs: jest.fn(),
  };
});

jest.mock('../../../hooks/usePACStatesForComponents', () => {
  const actual = jest.requireActual('../../../hooks/usePACState');
  return {
    ...actual,
    __esModule: true,
    default: () => {
      return { comp: PACState.pending };
    },
  };
});

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useTRPipelineRunsMock = useTRPipelineRuns as jest.Mock;

const getMockedResources = (kind: WatchK8sResource) => {
  if (!kind) {
    return [[], true];
  }
  if (kind.groupVersionKind === ComponentGroupVersionKind) {
    return [mockComponents, true];
  }
  if (kind?.groupVersionKind === PipelineRunGroupVersionKind) {
    return [mockPipelineRuns, true];
  }
  return [[], true];
};

describe('ComponentListViewPage', () => {
  beforeEach(() => {
    useK8sWatchResourceMock.mockImplementation(getMockedResources);
    paramValues = {};
  });

  it('should render skeleton if data is not loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    render(<ComponentListView applicationName="test-app" />);
    screen.getByTestId('data-table-skeleton');
  });

  it('should render button to add components', () => {
    render(<ComponentListView applicationName="test-app" />);
    const button = screen.getByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe(
      'http://localhost/application-pipeline/workspaces/test-ws/import?application=test-app',
    );
  });

  it('should render filter toolbar and filter components based on name', () => {
    render(<ComponentListView applicationName="test-app" />);
    expect(screen.getByTestId('component-list-toolbar')).toBeInTheDocument();
    const nameSearchInput = screen.getByTestId('name-input-filter');
    const searchInput = nameSearchInput.querySelector('.pf-v5-c-text-input-group__text-input');
    fireEvent.change(searchInput, { target: { value: 'nodejs' } });
    const componentList = screen.getByTestId('component-list');
    const componentListItems = within(componentList).getAllByTestId('component-list-item');
    expect(componentListItems.length).toBe(2);
  });

  it('should show a warning when showMergeStatus is set', () => {
    render(<ComponentListView applicationName="test-app" />);
    screen.getByTestId('components-unmerged-build-pr');
  });
  it('should filter components by type', async () => {
    const view = render(<ComponentListView applicationName="test-app" />);

    expect(view.getAllByTestId('component-list-item')).toHaveLength(2);

    // interact with filters
    const filterMenuButton = view.getByRole('button', { name: /filter/i });
    await fireEvent.click(filterMenuButton);

    const successCb = view.getByLabelText(/successful/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(successCb);
    view.rerender(<ComponentListView applicationName="test-app" />);

    expect(successCb.checked).toBe(true);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(1);
    fireEvent.click(successCb);
    view.rerender(<ComponentListView applicationName="test-app" />);

    expect(view.queryAllByTestId('component-list-item')).toHaveLength(2);

    const failedCb = view.getByLabelText(/failed/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(failedCb);
    view.rerender(<ComponentListView applicationName="test-app" />);

    expect(failedCb.checked).toBe(true);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(0);
    fireEvent.click(failedCb);
    view.rerender(<ComponentListView applicationName="test-app" />);

    expect(view.queryAllByTestId('component-list-item')).toHaveLength(2);

    const buildingCb = view.getByLabelText(/Building/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(buildingCb);
    view.rerender(<ComponentListView applicationName="test-app" />);

    expect(buildingCb.checked).toBe(true);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(0);

    // clear the filter
    const clearFilterButton = view.getAllByRole('button', { name: 'Clear filters' })[0];
    fireEvent.click(clearFilterButton);
    view.rerender(<ComponentListView applicationName="test-app" />);

    expect(view.queryAllByTestId('component-list-item')).toHaveLength(2);
  });
  it('should clear filters from empty state', async () => {
    const view = render(<ComponentListView applicationName="test-app" />);
    expect(screen.getAllByTestId('component-list-item')).toHaveLength(2);

    const nameSearchInput = screen.getByTestId('name-input-filter');
    const textFilterInput = nameSearchInput.querySelector('.pf-v5-c-text-input-group__text-input');
    await act(async () => {
      fireEvent.change(textFilterInput, { target: { value: 'no match' } });
    });

    view.rerender(<ComponentListView applicationName="test-app" />);
    expect(screen.queryAllByTestId('component-list-item')).toHaveLength(0);

    const clearFilterButton = screen.getByRole('button', { name: 'Clear all filters' });
    fireEvent.click(clearFilterButton);

    view.rerender(<ComponentListView applicationName="test-app" />);

    expect(screen.getAllByTestId('component-list-item')).toHaveLength(2);
  });

  it('should get more data if there is another page', () => {
    const getNextPageMock = jest.fn();
    useTRPipelineRunsMock.mockReturnValue([[], true, undefined, getNextPageMock]);
    render(<ComponentListView applicationName="test-app" />);
    expect(getNextPageMock).toHaveBeenCalled();
  });
});
