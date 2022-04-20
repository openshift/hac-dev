import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { InputField } from '../../../shared';

const ApplicationSection: React.FunctionComponent = () => {
  return (
    <Form isWidthLimited>
      <InputField name="application.name" label="Application Name" required />
    </Form>
  );
};

export default ApplicationSection;
