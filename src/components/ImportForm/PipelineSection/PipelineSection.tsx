import * as React from 'react';
import { useFormikContext } from 'formik';
import { DropdownField } from '../../../shared';
import { ImportFormValues } from '../type';
import { usePipelineTemplates } from './usePipelineTemplate';

export const PipelineSection: React.FunctionComponent = () => {
  const { values, setFieldValue } = useFormikContext<ImportFormValues>();
  const [template, loaded] = usePipelineTemplates();

  React.useEffect(() => {
    if (loaded && template?.defaultPipelineName && values.pipeline === '') {
      setFieldValue('pipeline', template.defaultPipelineName);
    }
  }, [loaded, setFieldValue, template?.defaultPipelineName, values.pipeline]);

  const dropdownItems = React.useMemo(() => {
    return loaded ? template.pipelines.map((t) => ({ key: t.name, value: t.name })) : [];
  }, [loaded, template?.pipelines]);

  return (
    <DropdownField
      name="pipeline"
      label="Pipeline"
      data-testid="secret-type-selector"
      items={dropdownItems}
      placeholder={!loaded ? 'Loading pipelines...' : 'Select a Pipeline'}
      isDisabled={!loaded}
      required
      validateOnChange
    />
  );
};
