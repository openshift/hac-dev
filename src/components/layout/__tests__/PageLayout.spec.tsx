import * as React from 'react';
import '@testing-library/jest-dom';
import { Router } from 'react-router';
import { render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import PageLayout from '../PageLayout';

describe('Page', () => {
  it('should render children and heading', () => {
    render(
      <PageLayout title="Title 1">
        <span data-testid="children-text">children</span>
      </PageLayout>,
    );
    expect(screen.getByTestId('children-text')).toBeInTheDocument();
    expect(screen.getByText('Title 1')).toBeInTheDocument();
  });

  it('should render breadcrumbs', () => {
    render(
      <Router history={createBrowserHistory()}>
        <PageLayout
          breadcrumbs={[
            { path: '/', name: 'Home' },
            { path: '/2', name: 'Home2' },
            { path: '/3', name: 'Home3' },
          ]}
          title="Title 1"
        >
          <span data-testid="children-text">children</span>
        </PageLayout>
      </Router>,
    );
    expect(screen.getByTestId('children-text')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Home2')).toBeInTheDocument();
    expect(screen.getByText('Home3')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(
      <PageLayout description="Description 1" title="Title 1">
        <span data-testid="children-text">children</span>
      </PageLayout>,
    );
    expect(screen.getByTestId('children-text')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(
      <PageLayout description="Description 1" title="Title 1" footer={<span>Footer Text</span>}>
        <span data-testid="children-text">children</span>
      </PageLayout>,
    );
    expect(screen.getByTestId('children-text')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Footer Text')).toBeInTheDocument();
  });
});
