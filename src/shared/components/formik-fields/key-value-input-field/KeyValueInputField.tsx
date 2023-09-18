import * as React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { useFormikContext, FormikValues } from 'formik';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import lodashValues from 'lodash/values';
import { BasicNameValueEditor } from '../../name-value-editor';
import { KeyValueFieldProps } from '../field-types';
import { getFieldId } from '../field-utils';
import FieldHelperText from '../FieldHelperText';

const KeyValueField: React.FC<KeyValueFieldProps> = ({
  label,
  helpText,
  description,
  labelIcon,
  required,
  entries,
  ...props
}) => {
  const { setFieldValue, values } = useFormikContext<FormikValues>();
  const fieldId = getFieldId(props.name, 'key-value-input');
  const keyValues = React.useMemo(() => {
    return !isEmpty(entries) ? entries.map((env) => lodashValues(env)) : [];
  }, [entries]);
  const [keyValue, setKeyValue] = React.useState(keyValues);
  const onChangeKeyValuePair = React.useCallback(
    ({ nameValuePairs: keyValuePairs }) => {
      if (keyValuePairs) {
        const updatedNameValuePairs = compact(
          keyValuePairs.map(([key, value]) => (value.length ? { key, value } : null)),
        );
        setKeyValue(keyValuePairs);
        setFieldValue(props.name, updatedNameValuePairs);
      }
    },
    [props.name, setFieldValue],
  );

  React.useEffect(() => {
    if (values.formReloadCount) {
      setKeyValue(keyValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.formReloadCount]);

  return (
    <FormGroup fieldId={fieldId} label={label} labelIcon={labelIcon} isRequired={required}>
      {description && <div className="pf-v5-c-form__helper-text">{description}</div>}
      <BasicNameValueEditor
        nameValuePairs={keyValue}
        valueString="Value"
        nameString="Key"
        addString="Add label"
        readOnly={false}
        updateParentData={onChangeKeyValuePair}
      />
      <FieldHelperText helpText={helpText} />
    </FormGroup>
  );
};

export default KeyValueField;
