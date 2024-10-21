import * as React from 'react';
import { screen, waitFor, configure } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { formikRenderer } from '../../../../utils/test-utils';
import { ComponentSection } from '../ComponentSection';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });

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
    await user.tab();
    await waitFor(() => screen.getByText('Show advanced Git options'));
  });

  it('should expand git options if source url is others', async () => {
    formikRenderer(<ComponentSection />, {
      source: { git: { url: '' } },
    });
    const user = userEvent.setup();
    const source = screen.getByPlaceholderText('Enter your source');

    await user.type(source, 'https://bitbucket.com/abcd/repo.git');
    await user.tab();
    await waitFor(() => screen.getByText('Hide advanced Git options'));
  });

  it('should show advanced Annotation section', async () => {
    formikRenderer(<ComponentSection />, {
      source: { git: { url: '' } },
    });
    const user = userEvent.setup();
    const source = screen.getByPlaceholderText('Enter your source');

    await user.type(source, 'https://bitbucket.com/abcd/repo.git');
    await user.tab();
    await waitFor(() => screen.getByTestId('url-annotation'));
  });

  it('should populate annotation fields', async () => {
    formikRenderer(<ComponentSection />, {
      source: { git: { url: '' } },
    });
    const user = userEvent.setup();
    const source = screen.getByPlaceholderText('Enter your source');

    await user.type(source, 'https://gitlab.com/abcd/repo.git');
    await user.tab();
    await waitFor(() =>
      expect((screen.getByTestId('url-annotation') as HTMLInputElement).value).toBe(
        'https://gitlab.com',
      ),
    );
  });
});
