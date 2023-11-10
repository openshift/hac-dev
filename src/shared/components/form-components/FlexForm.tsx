import React from 'react';
import { Form, FormProps } from '@patternfly/react-core';

const FlexForm: React.FC<React.PropsWithChildren<FormProps>> = ({ children, ...props }) => (
  <Form {...props}>{children}</Form>
);

export default FlexForm;
