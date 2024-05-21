import * as React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { formikRenderer } from '../../../../utils/test-utils';
import { ComponentSection } from '../ComponentSection';
import '@testing-library/jest-dom';

describe('ComponentSection', () => {
  it('should render component section', () => {
    formikRenderer(<ComponentSection />, { source: { git: { url: '' } } });
    screen.getByPlaceholderText('Enter your source');
    expect(screen.queryByTestId('git-reference')).not.toBeInTheDocument();
  });

  it('should render git options if source url is valid', async () => {
    formikRenderer(<ComponentSection />, {
      source: { git: { url: '' } },
    });
    const user = userEvent.setup();
    const source = screen.getByPlaceholderText('Enter your source');

    await user.type(source, 'https://github.com/abcd/repo.git');
    await user.click(screen.getByTestId('component-name'));
    await waitFor(() => screen.getByText('Show advanced Git options'));
  });
});
