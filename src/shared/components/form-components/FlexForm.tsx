import React from 'react';
import { Form, FormProps } from '@patternfly/react-core';

const FlexForm: React.FC<FormProps> = ({ children, ...props }) => (
  <Form {...props}>{children}</Form>
);

export default FlexForm;
