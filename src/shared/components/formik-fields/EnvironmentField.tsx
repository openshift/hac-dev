import * as React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { useFormikContext, FormikValues } from 'formik';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import lodashValues from 'lodash/values';
import { BasicNameValueEditor } from '../name-value-editor';
import { EnvironmentFieldProps } from './field-types';
import { getFieldId } from './field-utils';

const EnvironmentField: React.FC<EnvironmentFieldProps> = ({
  label,
  helpText,
  description,
  labelIcon,
  required,
  envs,
  ...props
}) => {
  const { setFieldValue, values } = useFormikContext<FormikValues>();
  const fieldId = getFieldId(props.name, 'env-input');
  const environmentVariables = React.useMemo(() => {
    return !isEmpty(envs) ? envs.map((env) => lodashValues(env)) : [['', '']];
  }, [envs]);
  const [nameValue, setNameValue] = React.useState(environmentVariables);
  const handleNameValuePairs = React.useCallback(
    ({ nameValuePairs }) => {
      const updatedNameValuePairs = compact(
        nameValuePairs.map(([name, value]) => {
          if (isObject(value)) {
            return { name, valueFrom: value };
          }
          if (value.length) {
            return { name, value };
          }
          return null;
        }),
      );
      setNameValue(nameValuePairs);
      setFieldValue(props.name, updatedNameValuePairs);
    },
    [props.name, setFieldValue],
  );

  React.useEffect(() => {
    if (values.formReloadCount) {
      setNameValue(environmentVariables);
    }
    // this effect only handles reload, so we disable dep on environmentVariables
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.formReloadCount]);

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      labelIcon={labelIcon}
      helperText={helpText}
      isRequired={required}
    >
      {description && <div className="pf-c-form__helper-text">{description}</div>}
      <BasicNameValueEditor
        nameValuePairs={nameValue}
        valueString="Value"
        nameString="Name"
        addString="Add value"
        readOnly={false}
        updateParentData={handleNameValuePairs}
      />
    </FormGroup>
  );
};

export default EnvironmentField;
