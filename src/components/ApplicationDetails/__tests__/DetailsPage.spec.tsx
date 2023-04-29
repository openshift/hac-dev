import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import DetailsPage from '../DetailsPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});

configure({ testIdAttribute: 'data-test' });

describe('DetailsPage', () => {
  it('should render the DetailsPage', () => {
    const { getByTestId } = routerRenderer(
      <DetailsPage headTitle="test" title="Details" baseURL="/" tabs={[]} />,
    );
    expect(getByTestId('details')).toBeInTheDocument();
  });

  it('should render the DetailsPage', () => {
    const { getByTestId } = routerRenderer(
      <DetailsPage headTitle="test" title="Details" baseURL="/" tabs={[]} />,
    );
    expect(getByTestId('details')).toBeInTheDocument();
  });

  it('should not render the tabs if invalid values are passed', () => {
    routerRenderer(<DetailsPage headTitle="test" title="Details" baseURL="/" tabs={null} />);
    expect(screen.queryByTestId('app-details__tabs')).not.toBeInTheDocument();
  });

  it('should render the tabs', () => {
    const { getByTestId } = routerRenderer(
      <DetailsPage
        headTitle="test"
        title="Details"
        baseURL="/"
        tabs={[{ key: 'tab1', label: 'Tab 1', component: <div>Tab1 content</div> }]}
      />,
    );
    expect(getByTestId('app-details__tabs')).toBeInTheDocument();
  });

  it('should render the tabs', async () => {
    const onTabSelect = jest.fn();
    routerRenderer(
      <DetailsPage
        headTitle="test"
        onTabSelect={onTabSelect}
        title="Details"
        baseURL="/"
        tabs={[
          { key: 'tab1', label: 'Tab 1', component: <div>Tab1 content</div> },
          { key: 'tab2', label: 'Tab 2', component: <div>Tab2 content</div> },
        ]}
      />,
    );

    const tab2 = screen.queryByTestId('details__tabItem tab2');

    await act(async () => {
      fireEvent.click(tab2);
    });
    expect(onTabSelect).toHaveBeenCalledWith('tab2');
  });

  it('should not render the actions if it is not passed', () => {
    routerRenderer(<DetailsPage headTitle="" title="Details" baseURL="/" tabs={[]} />);
    expect(screen.queryByTestId('details__actions')).not.toBeInTheDocument();
  });

  it('should not render actions invalid values are passed to actions', () => {
    routerRenderer(
      <DetailsPage headTitle="test" title="Details" baseURL="/" tabs={[]} actions={null} />,
    );
    expect(screen.queryByTestId('details__actions')).not.toBeInTheDocument();
  });

  it('should render the DetailsPage action groups', () => {
    const { getByTestId, getByRole } = routerRenderer(
      <DetailsPage
        headTitle="test"
        title="Details"
        baseURL="/"
        tabs={[]}
        actions={[
          {
            type: 'section-label',
            key: 'help-section',
            label: 'Help-Section',
          },
        ]}
      />,
    );
    const actionsMenu = getByRole('button', { name: /Actions/ });
    act(() => actionsMenu.click());
    expect(getByTestId('help-section')).toBeInTheDocument();
  });

  it('should not perform an action when the button is disabled', async () => {
    const componentMock = jest.fn();

    const { getByTestId, getByRole } = routerRenderer(
      <DetailsPage
        headTitle="test"
        title="Details"
        baseURL="/"
        tabs={[]}
        actions={[
          {
            key: 'disabled-section',
            label: 'Disabled Section',
            component: componentMock,
            isDisabled: true,
            disabledTooltip: 'disabled link',
          },
        ]}
      />,
    );
    const actionsMenu = getByRole('button', { name: /Actions/ });

    act(() => {
      actionsMenu.click();
    });
    fireEvent.click(getByTestId('disabled-section'));

    await waitFor(() => {
      expect(componentMock).not.toHaveBeenCalled();
    });
  });

  it('should show disabled tooltip on hovering a disabled action', async () => {
    const componentMock = jest.fn();

    const { getByTestId, getByRole } = routerRenderer(
      <DetailsPage
        headTitle="test"
        title="Details"
        baseURL="/"
        tabs={[]}
        actions={[
          {
            key: 'disabled-section',
            label: 'Disabled Section',
            component: componentMock,
            isDisabled: true,
            disabledTooltip: 'This link is disabled',
          },
        ]}
      />,
    );
    const actionsMenu = getByRole('button', { name: /Actions/ });

    act(() => {
      actionsMenu.click();
    });

    fireEvent.mouseEnter(getByTestId('disabled-section'));

    await waitFor(() => {
      screen.getByText('This link is disabled');
    });
  });

  it('should render head title based on the tab and headTitle', async () => {
    const onTabSelect = jest.fn();
    routerRenderer(
      <DetailsPage
        headTitle="tab-title"
        onTabSelect={onTabSelect}
        title="Details"
        baseURL="/"
        tabs={[
          { key: 'tab1', label: 'Tab 1', component: <div>Tab1 content</div> },
          { key: 'tab2', label: 'Tab 2', component: <div>Tab2 content</div> },
        ]}
      />,
    );

    await waitFor(() => expect(document.title).toEqual('tab-title - Tab 1 | CI/CD'));
  });
});
