import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { configure, render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { Formik, FormikConfig } from 'formik';
import EditableLabelField from '../EditableLabelField';
import '@testing-library/jest-dom';

type FormData = {
  editableLabel: string;
};
const Wrapper: React.FC<FormikConfig<FormData>> = ({ children, ...formikConfig }) => (
  <Formik {...formikConfig}>
    {(formikProps) => (
      <form onSubmit={formikProps.handleSubmit}>
        {children}
        <input type="submit" data-test="submit" value="Submit" />
      </form>
    )}
  </Formik>
);

const initialLabel: string = 'field value';

const fieldName: string = 'editableLabel';

const initialValues = {
  editableLabel: initialLabel,
};

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

const mockUseTranslation = useTranslation as jest.Mock;

beforeEach(() => {
  mockUseTranslation.mockImplementation(() => ({ t: (x) => x }));
});

afterEach(() => {
  jest.resetAllMocks();
});

configure({ testIdAttribute: 'data-test' });

describe('EditableLabelField', () => {
  it('renders field with value and edit icon only beside field value if label is not provided', () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <EditableLabelField name={fieldName} />
      </Wrapper>,
    );
    expect(screen.getByText(initialLabel)).toBeInTheDocument();
    const editIcon = screen.queryAllByTestId('pencil-icon');
    expect(editIcon).toHaveLength(1);
    expect(editIcon[0].parentElement).toHaveTextContent(initialLabel);
  });

  it('renders field with value and edit icon only beside label if label is provided', () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <EditableLabelField name={fieldName} label="label" />
      </Wrapper>,
    );
    const editIcon = screen.queryAllByTestId('pencil-icon');
    expect(screen.getByText(initialLabel)).toBeInTheDocument();
    expect(editIcon).toHaveLength(1);
    expect(editIcon[0].previousElementSibling).toHaveTextContent('label');
  });

  it('does not render edit icon if label is provided, after edit icon click ', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <EditableLabelField name={fieldName} />
      </Wrapper>,
    );
    expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('pencil-icon'));

    await waitFor(() => {
      expect(screen.queryByTestId('pencil-icon')).not.toBeInTheDocument();
    });
  });

  it('renders input field and submit and close buttons on edit icon click ', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <EditableLabelField name={fieldName} />
      </Wrapper>,
    );
    fireEvent.click(screen.getByTestId('pencil-icon'));
    await waitFor(() => {
      expect(screen.getByTestId('editable-label-input')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });
  });

  it('should show label field with updated value and unmount editable field on input followed by submit button click ', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <EditableLabelField name={fieldName} />
      </Wrapper>,
    );
    fireEvent.click(screen.getByTestId('pencil-icon'));
    await waitFor(() => {
      const inputField = screen.getByTestId('editable-label-input').querySelector('input');
      const submitButton = screen.getByTestId('check-icon');
      fireEvent.input(inputField, { target: { value: 'new field value' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('editable-label-input')).not.toBeInTheDocument();
      expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('field value')).not.toBeInTheDocument();
      expect(screen.getByText('new field value')).toBeInTheDocument();
      expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();
    });
  });

  it('should show label field with old value and unmount editable field on close button click ', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <EditableLabelField name={fieldName} />
      </Wrapper>,
    );
    fireEvent.click(screen.getByTestId('pencil-icon'));
    await waitFor(() => {
      const inputField = screen.getByTestId('editable-label-input').querySelector('input');
      const closeButton = screen.getByTestId('close-icon');
      fireEvent.input(inputField, { target: { value: 'new field value' } });
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('editable-label-input')).not.toBeInTheDocument();
      expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('new field value')).not.toBeInTheDocument();
      expect(screen.getByText('field value')).toBeInTheDocument();
      expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();
    });
  });

  it('should show label field with updated value and unmount editable field on input and enter press, form should not be submitted', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <EditableLabelField name={fieldName} />
      </Wrapper>,
    );
    fireEvent.click(screen.getByTestId('pencil-icon'));
    await waitFor(() => {
      const inputField = screen.getByTestId('editable-label-input').querySelector('input');
      fireEvent.input(inputField, { target: { value: 'new field value' } });
      fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter', charCode: 13 });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('editable-label-input')).not.toBeInTheDocument();
      expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('field value')).not.toBeInTheDocument();
      expect(screen.getByText('new field value')).toBeInTheDocument();
      expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();
    });
  });

  it('should set the component name field to editable mode and show the inline error message', async () => {
    render(
      <Wrapper
        initialValues={initialValues}
        onSubmit={(_, helpers) => {
          helpers.setErrors({ editableLabel: 'Component already exists' });
        }}
      >
        <EditableLabelField name={fieldName} />
      </Wrapper>,
    );

    act(() => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    await waitFor(() => {
      expect(
        within(screen.getByTestId('editable-label-input')).getByText('Component already exists'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeDisabled();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });
  });
});
