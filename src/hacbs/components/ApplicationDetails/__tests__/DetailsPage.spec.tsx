import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, render, screen } from '@testing-library/react';
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
    const { getByTestId } = render(<DetailsPage title="Details" tabs={[]} />);
    expect(getByTestId('details')).toBeInTheDocument();
  });

  it('should render the DetailsPage', () => {
    const { getByTestId } = render(<DetailsPage title="Details" tabs={[]} />);
    expect(getByTestId('details')).toBeInTheDocument();
  });

  it('should not render the tabs if invalid values are passed', () => {
    render(<DetailsPage title="Details" tabs={null} />);
    expect(screen.queryByTestId('details__tabs')).not.toBeInTheDocument();
  });

  it('should render the tabs', () => {
    const { getByTestId } = render(
      <DetailsPage
        title="Details"
        tabs={[{ key: 'tab1', label: 'Tab 1', component: <div>Tab1 content</div> }]}
      />,
    );
    expect(getByTestId('details__tabs')).toBeInTheDocument();
  });

  it('should render the tabs', async () => {
    const onTabSelect = jest.fn();
    render(
      <DetailsPage
        onTabSelect={onTabSelect}
        title="Details"
        tabs={[
          { key: 'tab1', label: 'Tab 1', component: <div>Tab1 content</div> },
          { key: 'tab2', label: 'Tab 1', component: <div>Tab1 content</div> },
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
    render(<DetailsPage title="Details" tabs={[]} />);
    expect(screen.queryByTestId('details__actions')).not.toBeInTheDocument();
  });

  it('should not render actions invalid values are passed to actions', () => {
    render(<DetailsPage title="Details" tabs={[]} actions={null} />);
    expect(screen.queryByTestId('details__actions')).not.toBeInTheDocument();
  });
});
