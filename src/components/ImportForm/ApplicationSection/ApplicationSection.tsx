import * as React from 'react';
import { InputField } from '../../../shared';

const ApplicationSection: React.FunctionComponent = () => {
  return <InputField name="application" label="Application name" required />;
};

export default ApplicationSection;
