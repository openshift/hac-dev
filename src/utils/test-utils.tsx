import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Form } from '@patternfly/react-core';
import { RenderOptions, render } from '@testing-library/react';
import { FormikValues, Formik } from 'formik';
import { WorkspaceContextData, WorkspaceProvider } from './workspace-context-utils';

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
  contextValues?: Partial<WorkspaceContextData>,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  render(element, {
    wrapper: ({ children }) => (
      <WorkspaceProvider
        value={{
          namespace,
          lastUsedWorkspace: 'test-ws',
          workspace: '',
          workspaceResource: undefined,
          workspaces: [],
          workspacesLoaded: false,
          updateWorkspace: jest.fn(),
          ...contextValues,
        }}
      >
        {children}
      </WorkspaceProvider>
    ),
    ...options,
  });

export const routerRenderer = (
  element: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  render(element, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options,
  });

export const mockLocation = (location?: {
  hash?: string;
  port?: number;
  pathname?: string;
  search?: string;
  origin?: string;
}) => {
  const windowLocation = JSON.stringify(window.location);
  delete window.location;
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: JSON.parse(windowLocation),
  });
  if (location) {
    Object.assign(window.location, location);
  }
};
