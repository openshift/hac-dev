import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import { CheckboxFieldProps } from './field-types';
import ToggleableFieldBase from './ToggleableFieldBase';

const CheckboxField: React.FC<React.PropsWithChildren<CheckboxFieldProps>> = (baseProps) => (
  <ToggleableFieldBase {...baseProps}>{(props) => <Checkbox {...props} />}</ToggleableFieldBase>
);

export default CheckboxField;
