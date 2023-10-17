import * as React from 'react';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { formikRenderer } from '../../../utils/test-utils';
import { EditParamsModal } from '../EditParamsModal';
import { IntegrationTestFormValues } from '../IntegrationTestForm/types';
import { MockIntegrationTestsWithParams } from '../IntegrationTestsListView/__data__/mock-integration-tests';

const initialValues: IntegrationTestFormValues = {
  name: MockIntegrationTestsWithParams[1].metadata.name,
  url: 'test-url',
  optional: true,
  params: MockIntegrationTestsWithParams[1].spec.params,
};

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    k8sPatchResource: jest.fn(),
  };
});

const patchResourceMock = k8sPatchResource as jest.Mock;
configure({ testIdAttribute: 'data-test' });

describe('EditParamsModal', () => {
  it('should render correct parameters', async () => {
    formikRenderer(<EditParamsModal intTest={MockIntegrationTestsWithParams[1]} />, initialValues);

    await waitFor(() => {
      screen.getByText('Parameters');
      screen.queryByText('colors');
      screen.queryByText('animals');
    });
  });

  it('should show multivalued params with values array', async () => {
    formikRenderer(<EditParamsModal intTest={MockIntegrationTestsWithParams[0]} />, initialValues);

    await waitFor(() => {
      screen.getByText('Parameters');
      screen.queryByText('colors');
      screen.queryByText('red');
      screen.queryByText('green');
      screen.queryByText('orange');
    });
  });

  it('should show single value params with value field', async () => {
    formikRenderer(<EditParamsModal intTest={MockIntegrationTestsWithParams[0]} />, initialValues);
    await waitFor(() => {
      screen.queryByText('animals');
      screen.queryByText('tiger');
    });
  });

  it('should show add parameters button', async () => {
    formikRenderer(<EditParamsModal intTest={MockIntegrationTestsWithParams[0]} />, initialValues);
    await waitFor(() => {
      screen.getByTestId('add-param-button');
    });
  });

  it('should call onClose callback when cancel button is clicked', async () => {
    const onClose = jest.fn();
    formikRenderer(
      <EditParamsModal intTest={MockIntegrationTestsWithParams[1]} onClose={onClose} />,
      initialValues,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('edit-params-modal')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('should have disabled Save Button', async () => {
    formikRenderer(<EditParamsModal intTest={MockIntegrationTestsWithParams[1]} />, initialValues);

    await waitFor(() => {
      expect(screen.queryByTestId('edit-params-modal')).toBeInTheDocument();
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      expect(saveBtn).toBeDisabled();
    });
  });

  it('should enable Save button on Edit', async () => {
    const onClose = jest.fn();
    formikRenderer(
      <EditParamsModal intTest={MockIntegrationTestsWithParams[1]} onClose={onClose} />,
      initialValues,
    );

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });
    const addParam = screen.getByTestId('add-param-button').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(addParam);
    });

    await waitFor(() => {
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      expect(saveBtn).not.toBeDisabled();
    });
  });

  it('should enable Save button on Edit', async () => {
    patchResourceMock.mockResolvedValue({});
    const onClose = jest.fn();
    formikRenderer(
      <EditParamsModal intTest={MockIntegrationTestsWithParams[1]} onClose={onClose} />,
      initialValues,
    );

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });
    const addParam = screen.getByTestId('add-param-button').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(addParam);
    });

    await waitFor(() => {
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      expect(saveBtn).not.toBeDisabled();
      fireEvent.click(saveBtn);
    });
    expect(patchResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryOptions: { name: 'test-app-test-2', ns: 'test-namespace' },
        patches: [
          {
            op: 'replace',
            path: '/spec/params',
            value: [
              { name: 'colors', values: ['red', 'green', 'orange'] },
              { name: 'animal', values: ['tiger'] },
              { name: 'param3', values: [''] },
            ],
          },
        ],
      }),
    );
  });

  it('should be able to add new Param', async () => {
    patchResourceMock.mockResolvedValue({});
    const onClose = jest.fn();
    formikRenderer(
      <EditParamsModal intTest={MockIntegrationTestsWithParams[1]} onClose={onClose} />,
      initialValues,
    );

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });
    const addParam = screen.getByTestId('add-param-button').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(addParam);
    });

    await waitFor(() => {
      const newParam = screen.getByTestId('param-2-value-0');
      fireEvent.input(newParam, {
        target: { value: 'new value' },
      });
    });

    await waitFor(() => {
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      expect(saveBtn).not.toBeDisabled();
      fireEvent.click(saveBtn);
    });

    expect(patchResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryOptions: { name: 'test-app-test-2', ns: 'test-namespace' },
        patches: [
          {
            op: 'replace',
            path: '/spec/params',
            value: [
              { name: 'colors', values: ['red', 'green', 'orange'] },
              { name: 'animal', values: ['tiger'] },
              { name: 'param3', values: ['new value'] },
            ],
          },
        ],
      }),
    );
  });

  it('should be able to delete param', async () => {
    patchResourceMock.mockResolvedValue({});
    const onClose = jest.fn();
    formikRenderer(
      <EditParamsModal intTest={MockIntegrationTestsWithParams[1]} onClose={onClose} />,
      initialValues,
    );

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      const deleteParam = screen.getByTestId('remove-param-2');
      fireEvent.click(deleteParam);
    });

    await waitFor(() => {
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      expect(saveBtn).not.toBeDisabled();
      fireEvent.click(saveBtn);
    });

    expect(patchResourceMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryOptions: { name: 'test-app-test-2', ns: 'test-namespace' },
        patches: [
          {
            op: 'replace',
            path: '/spec/params',
            value: [{ name: 'colors', values: ['red', 'green', 'orange'] }],
          },
        ],
      }),
    );
  });
});
