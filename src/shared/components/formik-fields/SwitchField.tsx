import React from 'react';
import { Switch } from '@patternfly/react-core';
import { SwitchFieldProps } from './field-types';
import ToggleableFieldBase from './ToggleableFieldBase';

const SwitchField: React.FC<React.PropsWithChildren<SwitchFieldProps>> = (baseProps) => (
  <ToggleableFieldBase {...baseProps}>{(props) => <Switch {...props} />}</ToggleableFieldBase>
);

export default SwitchField;
