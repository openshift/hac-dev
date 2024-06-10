import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, fireEvent, screen, act, waitFor } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import CVEFormContent from '../CVEFormContent';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    useK8sWatchResource: jest
      .fn()
      .mockReturnValue([
        [{ metadata: { name: 'p1' } }, { metadata: { name: 'p2' } }, { metadata: { name: 'p3' } }],
        true,
      ]),
  };
});

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
    expect(screen.getByRole('textbox', { name: 'CVE ID' })).toBeVisible();
  });

  it('should show correct values', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />, {
      key: 'CVE-120',
      components: [
        { name: 'a', packages: ['p1', 'p2', 'p3'] },
        { name: 'b', packages: ['p1', 'p2', 'p3'] },
      ],
    });
    expect((screen.getByRole('textbox', { name: 'CVE ID' }) as HTMLInputElement).value).toBe(
      'CVE-120',
    );
  });

  it('should render component fields ', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />, {
      key: 'CVE-120',
      components: [
        { name: 'a', packages: ['p1', 'p2', 'p3'] },
        { name: 'b', packages: ['p1', 'p2', 'p3'] },
      ],
    });
    screen.getByTestId('component-field');
    await waitFor(() => {
      expect(screen.getByTestId('component-0')).toBeInTheDocument();
      expect(screen.getByTestId('component-1')).toBeInTheDocument();
    });
  });

  it('should remove component fields ', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />, {
      key: 'CVE-120',
      components: [
        { name: 'a', packages: ['p1', 'p2', 'p3'] },
        { name: 'b', packages: ['p1', 'p2', 'p3'] },
      ],
    });
    screen.getByTestId('component-field');
    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect(screen.queryByTestId('component-1')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.queryByTestId('remove-component-0'));
    });
    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect(screen.queryByTestId('component-1')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('component-0').getElementsByClassName('pf-v5-c-dropdown__toggle-text')[0]
        .innerHTML,
    ).toBe('b');
  });

  it('should have disabled Submit button when ID not there', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />);
    expect(screen.getByTestId('add-cve-btn')).toBeDisabled();
  });

  it('should render multiple packages ', async () => {
    formikRenderer(<CVEFormContent modalToggle={null} />, {
      key: 'CVE-120',
      components: [
        { name: 'a', packages: ['p1', 'p2', 'p3'] },
        { name: 'b', packages: ['p3', 'p4', 'p3'] },
      ],
    });
    screen.getByTestId('component-field');
    expect((screen.getByTestId('cmp-0-pac-0') as HTMLInputElement).value).toBe('p1');
    expect((screen.getByTestId('cmp-1-pac-0') as HTMLInputElement).value).toBe('p3');
  });
});
