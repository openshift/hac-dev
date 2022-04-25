import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { RenderOptions, render } from '@testing-library/react';
import { FormikValues, Formik } from 'formik';

export const formikRenderer = (
  element: React.ReactElement,
  initialValues?: FormikValues,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  render(element, {
    wrapper: ({ children }) => (
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {({ handleSubmit }) => <Form onSubmit={handleSubmit}>{children}</Form>}
      </Formik>
    ),
    ...options,
  });
