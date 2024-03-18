import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, screen, act, fireEvent } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import BugFormContent from '../BugFormContent';

describe('BugFormContent', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show correct heading ', async () => {
    formikRenderer(<BugFormContent modalToggle={null} />);
    expect(
      screen.getByText('Provide information about a Bug that has already been resolved.'),
    ).toBeVisible();
  });

  it('should show correct input fields ', async () => {
    formikRenderer(<BugFormContent modalToggle={null} />);

    expect(screen.getByRole('textbox', { name: 'Bug issue key' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Summary' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'URL' })).toBeVisible();
  });

  it('should show correct values', async () => {
    formikRenderer(<BugFormContent modalToggle={null} />, {
      key: 'RHTAP-120',
      url: 'url1',
      summary: 'summary',
    });
    expect((screen.getByRole('textbox', { name: 'Bug issue key' }) as HTMLInputElement).value).toBe(
      'RHTAP-120',
    );
    expect((screen.getByRole('textbox', { name: 'URL' }) as HTMLInputElement).value).toBe('url1');
    expect((screen.getByRole('textbox', { name: 'Summary' }) as HTMLInputElement).value).toBe(
      'summary',
    );
  });

  it('should have disabled Submit button when url and key not there', async () => {
    formikRenderer(<BugFormContent modalToggle={null} />);
    expect(screen.getByTestId('add-bug-btn')).toBeDisabled();
  });

  it('should have disabled Submit button and error text when url is invalid', () => {
    formikRenderer(<BugFormContent modalToggle={null} />);
    const key = screen.getByTestId('bug-issue-key');
    const url = screen.getByTestId('bug-url');

    act(() => {
      fireEvent.change(key, { value: 'ISSUE-420' });
      fireEvent.change(url, { value: 'invalid' });
    });
    expect(screen.getByTestId('add-bug-btn')).toBeDisabled();
    screen.findByText('Invalid URL.');
  });
});
