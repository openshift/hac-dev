import * as React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { GettingStartedCard } from './GettingStartedCard';

describe('GettingStartedCard', () => {
  afterEach(jest.clearAllMocks);

  it('should be hidden when dismissed', () => {
    render(
      <GettingStartedCard localStorageKey="key" title="Title text" imgSrc={imageUrl}>
        Description text
      </GettingStartedCard>,
    );
    expect(screen.getByText('Title text')).toBeVisible();
    expect(screen.getByText('Description text')).toBeVisible();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Title Text')).not.toBeInTheDocument();
  });

  it('should not be shown when local storage key is set', () => {
    render(
      <GettingStartedCard localStorageKey="key" title="Title text" imgSrc={imageUrl}>
        Description text
      </GettingStartedCard>,
    );
    expect(screen.queryByText('Title Text')).not.toBeInTheDocument();
  });
});
