import * as React from 'react';
import { Grid, GridItem, TextInputTypes, ValidatedOptions } from '@patternfly/react-core';
import { useField, useFormikContext } from 'formik';
import {
  EnvironmentField,
  InputField,
  NumberSpinnerField,
  ResourceLimitField,
  SwitchField,
} from '../../../shared';
import HelpPopover from '../../HelpPopover';
import { convertBaseValueToUnits, convertUnitValueToBaseValue } from '../utils/conversion-utils';
import { CPUUnits, DetectedFormComponent, ImportFormValues, MemoryUnits } from '../utils/types';

import './ReviewComponentCard.scss';

type ComponentFormProps = {
  detectedComponent: DetectedFormComponent;
  detectedComponentIndex: number;
  editMode?: boolean;
};

export const ComponentForm: React.FC<React.PropsWithChildren<ComponentFormProps>> = ({
  detectedComponent,
  detectedComponentIndex,
  editMode = false,
}) => {
  const component = detectedComponent.componentStub;
  const targetPortDetected = detectedComponent.targetPortDetected || editMode;
  const fieldPrefix = `components[${detectedComponentIndex}].componentStub`;
  const [targetPortTouched, setTargetPortTouched] = React.useState(false);
  const [, { value: selectedRuntime }] = useField<string>(
    `components[${detectedComponentIndex}].selectedRuntime`,
  );
  const {
    values: { resourceLimits, components },
  } = useFormikContext<ImportFormValues>();

  return (
    <>
      <Grid hasGutter>
        <GridItem sm={12} lg={4}>
          <InputField
            data-test={`${fieldPrefix}.targetPort`}
            name={`${fieldPrefix}.targetPort`}
            label="Target port"
            helpText={
              targetPortDetected || targetPortTouched
                ? 'Target port for traffic.'
                : "We can't detect your target port. Check if it's correct."
            }
            type={TextInputTypes.number}
            min={1}
            max={65535}
            onChange={() => setTargetPortTouched(true)}
            onBlur={() => setTargetPortTouched(true)}
            validated={
              targetPortDetected || targetPortTouched
                ? ValidatedOptions.default
                : ValidatedOptions.warning
            }
          />
        </GridItem>
        {selectedRuntime === 'Dockerfile' && (
          <GridItem sm={12} lg={4}>
            <InputField
              name={`${fieldPrefix}.source.git.dockerfileUrl`}
              label="Dockerfile"
              type={TextInputTypes.text}
              placeholder="Dockerfile"
              labelIcon={
                <HelpPopover bodyContent="You can modify this path to point to your Dockerfile." />
              }
            />
          </GridItem>
        )}
        {!editMode && (
          <GridItem sm={12} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
            <SwitchField
              name={`components[${detectedComponentIndex}].defaultBuildPipeline`}
              label="Default build pipeline"
            />
            &nbsp;
            <HelpPopover bodyContent="A default build pipeline skips several advanced tasks to get your application running sooner." />
          </GridItem>
        )}
      </Grid>
      <div className="review-component-card__limits">
        <ResourceLimitField
          name={`${fieldPrefix}.resources.cpu`}
          unitName={`${fieldPrefix}.resources.cpuUnit`}
          label="CPU"
          minValue={0}
          maxValue={
            convertBaseValueToUnits(
              convertUnitValueToBaseValue(resourceLimits?.max?.cpu, resourceLimits?.max?.cpuUnit)
                .value,
              components?.[detectedComponentIndex]?.componentStub?.resources?.cpuUnit,
            ).value
          }
          unitOptions={CPUUnits}
          helpText="Amount of CPU the container is guaranteed"
        />
        <ResourceLimitField
          name={`${fieldPrefix}.resources.memory`}
          unitName={`${fieldPrefix}.resources.memoryUnit`}
          label="Memory"
          minValue={0}
          maxValue={
            convertBaseValueToUnits(
              convertUnitValueToBaseValue(
                resourceLimits?.max?.memory,
                resourceLimits?.max?.memoryUnit,
              ).value,
              components?.[detectedComponentIndex]?.componentStub?.resources?.memoryUnit,
            ).value
          }
          unitOptions={MemoryUnits}
          helpText="Amount of memory the container is guaranteed"
        />
        <NumberSpinnerField
          name={`${fieldPrefix}.replicas`}
          label="Instances"
          min={0}
          helpText="Number of instances of your image"
        />
      </div>
      <EnvironmentField
        name={`${fieldPrefix}.env`}
        envs={component.env}
        label="Environment variables"
        labelIcon={
          <HelpPopover bodyContent="We use these default values to deploy this component. You can customize the values for each of your environments later by editing the deployment settings." />
        }
      />
    </>
  );
};
