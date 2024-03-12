import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, fireEvent, screen, act } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import CVEFormContent from '../CVEFormContent';

describe('CVEFormContent', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show correct heading ', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />);
    expect(
      screen.getByText('Provide information about a CVE that has already been resolved.'),
    ).toBeVisible();
  });

  it('should show correct input fields ', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />);
    expect(screen.getByRole('textbox', { name: 'CVE key' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Summary' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'URL for the CVE' })).toBeVisible();
  });

  it('should show correct values', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />, {
      key: 'CVE-120',
      url: 'url1',
      summary: 'summary',
      components: ['a', 'b', 'c'],
    });
    expect((screen.getByRole('textbox', { name: 'CVE key' }) as HTMLInputElement).value).toBe(
      'CVE-120',
    );
    expect(
      (screen.getByRole('textbox', { name: 'URL for the CVE' }) as HTMLInputElement).value,
    ).toBe('url1');
    expect((screen.getByRole('textbox', { name: 'Summary' }) as HTMLInputElement).value).toBe(
      'summary',
    );
  });

  it('should render component field ', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />, {
      key: 'CVE-120',
      url: 'url1',
      summary: 'summary',
      components: ['a', 'b', 'c'],
    });
    screen.getByTestId('component-field');
  });

  it('should have disabled Submit button when url and key not there', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />);
    expect(screen.getByTestId('add-cve-btn')).toBeDisabled();
  });

  it('should have disabled Submit button and error text when url is invalid', () => {
    formikRenderer(<CVEFormContent modalToggle={null} />);
    const key = screen.getByTestId('cve-issue-key');
    const url = screen.getByTestId('cve-url');

    act(() => {
      fireEvent.change(key, { value: 'CVE-420' });
      fireEvent.change(url, { value: 'invalid' });
    });
    expect(screen.getByTestId('add-cve-btn')).toBeDisabled();
    screen.findByText('Invalid URL.');
  });
});
