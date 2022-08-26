import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, screen, within } from '@testing-library/react';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { ComponentGroupVersionKind } from '../../../models';
import { PipelineRunGroupVersionKind } from '../../../shared';
import { routerRenderer } from '../../../utils/test-utils';
import { componentCRMocks, mockApplication } from '../../ApplicationDetailsView/__data__/mock-data';
import { mockPipelineRuns } from '../../ApplicationDetailsView/__data__/mock-pipeline-run';
import { ComponentDetails } from '../ComponentDetails';
import '@testing-library/jest-dom';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const getMockedResources = (kind: WatchK8sResource) => {
  if (kind.groupVersionKind === ComponentGroupVersionKind) {
    return [componentCRMocks, true];
  }
  if (kind.groupVersionKind === PipelineRunGroupVersionKind) {
    return [mockPipelineRuns, true];
  }
  return [[], true];
};

describe('ComponentDetails', () => {
  const mockK8sWatchResource = useK8sWatchResource as jest.Mock;
  it('should render Component Details component', () => {
    mockK8sWatchResource.mockReturnValue([[], false, undefined]);
    routerRenderer(<ComponentDetails application={mockApplication} />);
    screen.getByText('Application components');
  });

  it('should render loading indicator', () => {
    mockK8sWatchResource.mockReturnValue([[], false, undefined]);
    routerRenderer(<ComponentDetails application={mockApplication} />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if component CR are loaded and is empty', () => {
    mockK8sWatchResource.mockReturnValue([[], true, undefined]);
    routerRenderer(<ComponentDetails application={mockApplication} />);
    screen.getByText('No components');
    screen.getByText('Add component');
    screen.getByText('To get started, add a component to your application.');
    const button = screen.getByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe(
      'http://localhost/app-studio/import?application=test-application',
    );
  });

  it('should render component details if component CR is available', () => {
    mockK8sWatchResource.mockImplementation(getMockedResources);
    routerRenderer(<ComponentDetails application={mockApplication} />);
    expect(screen.queryByText('No components')).not.toBeInTheDocument();
    expect(screen.getByTestId('component-list-toolbar')).toBeInTheDocument();
    const searchInput = screen.getByRole('textbox', { name: 'name filter' });
    fireEvent.change(searchInput, { target: { value: 'nodejs' } });
    const componentList = screen.getByTestId('component-list');
    const componentListItems = within(componentList).getAllByTestId('component-list-item');
    expect(componentListItems.length).toBe(1);
  });
});
