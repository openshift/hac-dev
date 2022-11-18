import * as React from 'react';
import { render, screen } from '@testing-library/react';
import PipelineRunEmptyState from '../PipelineRunEmptyState';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

describe('PipelineRunEmptyState', () => {
  it('should render correct Link to Application Name', () => {
    render(<PipelineRunEmptyState applicationName="test" />);
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      '/app-studio/applications/test?activeTab=components',
    );
    screen.getByText('Go to components tab');
  });
});
