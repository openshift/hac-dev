import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, configure } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import ComponentField from '../ComponentField';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    useK8sWatchResource: jest
      .fn()
      .mockReturnValue([
        [{ metadata: { name: 'a' } }, { metadata: { name: 'b' } }, { metadata: { name: 'c' } }],
        true,
      ]),
  };
});

configure({ testIdAttribute: 'data-test' });

describe('ComponentField', () => {
  it('should initially load with no components and add component on button click', () => {
    formikRenderer(<ComponentField name="components" />, { components: [] });

    const addCmpBtn = screen.queryByTestId('add-component-button');
    expect(addCmpBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addCmpBtn);
    });
    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
  });

  it('should load with formik component values', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
    });

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    const addCmpBtn = screen.queryByTestId('add-component-button');
    expect(addCmpBtn).toBeInTheDocument();

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect(
      screen.queryByTestId('component-0').getElementsByClassName('pf-v5-c-dropdown__toggle-text')[0]
        .innerHTML,
    ).toBe('a');
    expect(screen.queryByTestId('component-1')).toBeInTheDocument();
    expect(
      screen.queryByTestId('component-1').getElementsByClassName('pf-v5-c-dropdown__toggle-text')[0]
        .innerHTML,
    ).toBe('b');
  });

  it('should show disabled remove button when only one component', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: [{ name: 'a' }],
    });

    expect(screen.queryByTestId('remove-component-0')).toBeInTheDocument();
    expect(screen.queryByTestId('remove-component-0')).toBeDisabled();
  });

  it('should remove component when remove button in clicked', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: [{ name: 'remove-component' }, { name: 'cmp2' }],
    });

    expect(screen.queryByTestId('remove-component-0')).toBeInTheDocument();
    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect(
      screen.queryByTestId('component-0').getElementsByClassName('pf-v5-c-dropdown__toggle-text')[0]
        .innerHTML,
    ).toBe('remove-component');

    act(() => {
      fireEvent.click(screen.queryByTestId('remove-component-0'));
    });
    expect(
      screen.queryByTestId('component-0').getElementsByClassName('pf-v5-c-dropdown__toggle-text')[0]
        .innerHTML,
    ).toBe('cmp2');
  });

  it('should show packages', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: [{ name: 'a', packages: ['p1', 'p2'] }],
    });
    expect(screen.queryByTestId('cmp-0-pac-0')).toBeInTheDocument();
    expect((screen.queryByTestId('cmp-0-pac-0') as HTMLInputElement).value).toBe('p1');
    expect(screen.queryByTestId('cmp-0-pac-1')).toBeInTheDocument();
    expect((screen.queryByTestId('cmp-0-pac-1') as HTMLInputElement).value).toBe('p2');
  });

  it('should add packages', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: [{ name: 'a', packages: ['p1', 'p2'] }],
    });
    expect(screen.queryByTestId('cmp-0-pac-0')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.queryByTestId('add-cmp-0-pac'));
    });
    expect(screen.queryByTestId('cmp-0-pac-2')).toBeInTheDocument();
    expect((screen.queryByTestId('cmp-0-pac-2') as HTMLInputElement).value).toBe('');
  });

  it('should remove packages', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: [{ name: 'a', packages: ['p1', 'p2'] }],
    });

    expect(screen.queryByTestId('cmp-0-pac-0')).toBeInTheDocument();
    expect((screen.queryByTestId('cmp-0-pac-0') as HTMLInputElement).value).toBe('p1');
    expect(screen.queryByTestId('cmp-0-pac-1')).toBeInTheDocument();
    expect((screen.queryByTestId('cmp-0-pac-1') as HTMLInputElement).value).toBe('p2');
    act(() => {
      fireEvent.click(screen.queryByTestId('remove-cmp-0-pac-1'));
    });
    expect(screen.queryByTestId('cmp-0-pac-1')).not.toBeInTheDocument();
  });
});
