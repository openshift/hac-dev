import * as React from 'react';
// use Input field from 'formik-pf'
import { InputField as FpfInput } from '../../../shared';

export const InputField: React.FunctionComponent<React.ComponentProps<typeof FpfInput>> = (
  props,
) => <FpfInput {...props} className="import-flow__input" />;
