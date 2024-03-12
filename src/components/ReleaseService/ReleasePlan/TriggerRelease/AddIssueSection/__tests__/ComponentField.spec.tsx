import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, configure } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import ComponentField from '../ComponentField';

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
      components: ['cmp1', 'cmp2'],
    });

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    const addCmpBtn = screen.queryByTestId('add-component-button');
    expect(addCmpBtn).toBeInTheDocument();

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect((screen.queryByTestId('component-0') as HTMLInputElement).value).toBe('cmp1');
    expect(screen.queryByTestId('component-1')).toBeInTheDocument();
    expect((screen.queryByTestId('component-1') as HTMLInputElement).value).toBe('cmp2');
  });

  it('should change the value properly', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: ['cmp1'],
    });

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    const addCmpBtn = screen.queryByTestId('add-component-button');
    expect(addCmpBtn).toBeInTheDocument();

    act(() => {
      fireEvent.change(screen.queryByTestId('component-0'), {
        target: { value: 'component2' },
      });
    });

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect((screen.queryByTestId('component-0') as HTMLInputElement).value).toBe('component2');
  });

  it('should change the value properly', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: ['cmp1'],
    });

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    const addCmpBtn = screen.queryByTestId('add-component-button');
    expect(addCmpBtn).toBeInTheDocument();

    act(() => {
      fireEvent.change(screen.queryByTestId('component-0'), {
        target: { value: 'component2' },
      });
    });

    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect((screen.queryByTestId('component-0') as HTMLInputElement).value).toBe('component2');
  });

  it('should show disabled remove button when only one component', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: ['cmp1'],
    });

    expect(screen.queryByTestId('remove-component-0')).toBeInTheDocument();
    expect(screen.queryByTestId('remove-component-0')).toBeDisabled();
  });

  it('should remove component when remove button in clicked', async () => {
    formikRenderer(<ComponentField name="components" />, {
      components: ['remove-component', 'cmp2'],
    });

    expect(screen.queryByTestId('remove-component-0')).toBeInTheDocument();
    expect(screen.queryByTestId('component-0')).toBeInTheDocument();
    expect((screen.queryByTestId('component-0') as HTMLInputElement).value).toBe(
      'remove-component',
    );

    act(() => {
      fireEvent.click(screen.queryByTestId('remove-component-0'));
    });

    expect((screen.queryByTestId('component-0') as HTMLInputElement).value).toBe('cmp2');
  });
});
