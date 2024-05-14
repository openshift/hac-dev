import * as React from 'react';
import { useFormikContext } from 'formik';
import { DropdownField } from '../../../shared';
import { ImportFormValues } from '../type';
import { usePipelineTemplates } from './usePipelineTemplate';

export const PipelineSection: React.FunctionComponent = () => {
  const [template, loaded] = usePipelineTemplates();
  const { values, setFieldValue } = useFormikContext<ImportFormValues>();

  const dropdownItems = React.useMemo(() => {
    return loaded ? template.pipelines.map((t) => ({ key: t.name, value: t.name })) : [];
  }, [loaded, template?.pipelines]);

  React.useEffect(() => {
    if (loaded && values.pipeline.name) {
      const bundle = template.pipelines.find((t) => t.name === values.pipeline.name)?.bundle;
      setFieldValue('pipeline.bundle', bundle);
    }
  }, [loaded, setFieldValue, template?.pipelines, values.pipeline.name]);

  return (
    <DropdownField
      name="pipeline.name"
      label="Pipelines"
      data-testid="secret-type-selector"
      items={dropdownItems}
      placeholder={!loaded ? 'Loading pipelines...' : 'Select a Pipeline'}
      isDisabled={!loaded}
      required
    />
  );
};
