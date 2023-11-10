import * as React from 'react';
import { useField } from 'formik';
import { Base64 } from 'js-base64';
import { InputField } from '../../../shared';

type EncodedInputFieldProps = Omit<React.ComponentProps<typeof InputField>, 'value' | 'onChange'>;

const EncodedInputField: React.FC<React.PropsWithChildren<EncodedInputFieldProps>> = (props) => {
  const [, { value }, { setValue }] = useField<string>(props.name);

  const onChange = React.useCallback(
    (data: string) => {
      setValue(data ? Base64.encode(data) : '', true);
    },
    [setValue],
  );

  const decodedValue = React.useMemo(() => (value ? Base64.decode(value) : ''), [value]);

  return <InputField {...props} value={decodedValue} onChange={(e) => onChange(e.target.value)} />;
};

export default EncodedInputField;
