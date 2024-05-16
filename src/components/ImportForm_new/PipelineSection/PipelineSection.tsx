import * as React from 'react';
import { DropdownField } from '../../../shared';
import { usePipelineTemplates } from './usePipelineTemplate';

export const PipelineSection: React.FunctionComponent = () => {
  const [template, loaded] = usePipelineTemplates();

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
