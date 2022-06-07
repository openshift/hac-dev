import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { RenderOptions, render } from '@testing-library/react';
import { FormikValues, Formik } from 'formik';
import { NamespaceContext } from '../components/NamespacedPage/NamespacedPage';

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

export const namespaceRenderer = (
  element: React.ReactElement,
  namespace: string = 'test-ns',
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  render(element, {
    wrapper: ({ children }) => (
      <NamespaceContext.Provider value={{ namespace }}>{children}</NamespaceContext.Provider>
    ),
    ...options,
  });
