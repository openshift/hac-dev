import { render, screen } from '@testing-library/react';
import { Page } from '../Page';
import * as React from 'react';
import '@testing-library/jest-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

describe('Page', () => {
  it('should render children and heading', () => {
    render(
      <Page heading="Heading 1">
        <span data-testid="children-text">children</span>
      </Page>,
    );
    expect(screen.getByTestId('children-text')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
  });

  it('should render breadcrumbs', () => {
    render(
      <Router history={createBrowserHistory()}>
        <Page
          breadcrumbs={[
            { path: '/', name: 'Home' },
            { path: '/2', name: 'Home2' },
            { path: '/3', name: 'Home3' },
          ]}
          heading="Heading 1"
        >
          <span data-testid="children-text">children</span>
        </Page>
      </Router>,
    );
    expect(screen.getByTestId('children-text')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Home2')).toBeInTheDocument();
    expect(screen.getByText('Home3')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(
      <Page description="Description 1" heading="Heading 1">
        <span data-testid="children-text">children</span>
      </Page>,
    );
    expect(screen.getByTestId('children-text')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });
});
