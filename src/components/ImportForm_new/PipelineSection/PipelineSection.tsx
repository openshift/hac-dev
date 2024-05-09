import * as React from 'react';
import { useFormikContext } from 'formik';
import { DropdownField } from '../../../shared';
// import { usePipelineTemplates } from './usePipelineTemplate';

export const PipelineSection: React.FunctionComponent = () => {
  //   const [pipelines, loaded] = usePipelineTemplates();
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const setValues = React.useCallback(
    (type) => {
      setFieldValue('pipeline', type);
      setFieldTouched('pipeline', true);
    },
    [setFieldValue, setFieldTouched],
  );

  //   console.log('#################', pipelines, loaded);

  return (
    <DropdownField
      name="pipeline"
      label="Pipelines"
      data-testid="secret-type-selector"
      items={[]}
      title="Select a Pipeline"
      onChange={setValues}
      isDisabled={false}
      fullWidth
      required
    />
  );
};
