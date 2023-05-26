import * as React from 'react';
import {
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  Flex,
  FlexItem,
  FormSection,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  TextInputTypes,
  Title,
  TitleSizes,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useField } from 'formik';
import {
  EnvironmentField,
  InputField,
  NumberSpinnerField,
  ResourceLimitField,
  SwitchField,
} from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import GitRepoLink from '../../GitLink/GitRepoLink';
import HelpPopover from '../../HelpPopover';
import SecretSection from '../SecretSection/SecretSection';
import { CPUUnits, DetectedFormComponent, MemoryUnits } from '../utils/types';
import { RuntimeSelector } from './RuntimeSelector';

import './ReviewComponentCard.scss';

type ReviewComponentCardProps = {
  detectedComponent: DetectedFormComponent;
  detectedComponentIndex: number;
  editMode?: boolean;
  isExpanded?: boolean;
  showRuntimeSelector?: boolean;
};

export const ReviewComponentCard: React.FC<ReviewComponentCardProps> = ({
  detectedComponent,
  detectedComponentIndex,
  editMode = false,
  isExpanded = false,
  showRuntimeSelector,
}) => {
  const component = detectedComponent.componentStub;
  const name = component.componentName;
  const targetPortDetected = detectedComponent.targetPortDetected || editMode;
  const fieldPrefix = `components[${detectedComponentIndex}].componentStub`;
  const [expandedComponent, setExpandedComponent] = React.useState(isExpanded);
  const [targetPortTouched, setTargetPortTouched] = React.useState(false);
  const [, { value: language }] = useField<string>(
    `components[${detectedComponentIndex}].language`,
  );

  return (
    <Card isFlat isCompact isSelected={expandedComponent} isExpanded={expandedComponent}>
      <CardHeader
        onExpand={() => setExpandedComponent((v) => !v)}
        toggleButtonProps={{
          id: `toggle-${name}`,
          'aria-label': name,
          'aria-labelledby': `review-${name} toggle-${name}`,
          'aria-expanded': expandedComponent,
          'data-test': `${name}-toggle-button`,
        }}
      >
        <Flex className="pf-u-flex-1" direction={{ default: 'column', sm: 'row' }}>
          <FlexItem flex={{ default: 'flex_4', md: 'flex_3' }}>
            <InputField
              name={`${fieldPrefix}.componentName`}
              label="Component name"
              type={TextInputTypes.text}
              isDisabled={editMode}
              dataTest="component-name-field"
            />
            <br />
            {component.source?.git?.url ? (
              <GitRepoLink
                url={component.source.git.url}
                revision={component.source.git.revision}
                context={component.source.git.context}
              />
            ) : (
              <ExternalLink
                href={
                  component.containerImage?.includes('http')
                    ? component.containerImage
                    : `https://${component.containerImage}`
                }
                text={component.containerImage}
              />
            )}
          </FlexItem>
          {showRuntimeSelector && (
            <FlexItem flex={{ default: 'flex_2' }}>
              <RuntimeSelector detectedComponentIndex={detectedComponentIndex} />
            </FlexItem>
          )}
        </Flex>
      </CardHeader>
      <CardExpandableContent>
        <CardBody className="review-component-card__card-body">
          <FormSection>
            <br />
            <Title size={TitleSizes.md} headingLevel="h4">
              Build & deploy configuration
              <HelperText style={{ fontWeight: 100 }}>
                <HelperTextItem variant="indeterminate">
                  This component will determine the strategy and process inputs and will be deployed
                  to your development environment automatically.
                </HelperTextItem>
              </HelperText>
            </Title>

            <Grid hasGutter>
              <GridItem sm={12} lg={4}>
                <InputField
                  data-test={`${fieldPrefix}.targetPort`}
                  name={`${fieldPrefix}.targetPort`}
                  label="Target port"
                  helpText="Target port for traffic."
                  type={TextInputTypes.number}
                  min={1}
                  max={65535}
                  onChange={() => setTargetPortTouched(true)}
                  onBlur={() => setTargetPortTouched(true)}
                  helpTextInvalid="We can't detect your target port. Check if it's correct."
                  validated={
                    targetPortDetected || targetPortTouched
                      ? ValidatedOptions.default
                      : ValidatedOptions.error
                  }
                />
              </GridItem>
              {language === 'Dockerfile' && (
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
                unitOptions={CPUUnits}
                helpText="Amount of CPU the container is guaranteed"
              />
              <ResourceLimitField
                name={`${fieldPrefix}.resources.memory`}
                unitName={`${fieldPrefix}.resources.memoryUnit`}
                label="Memory"
                minValue={0}
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
                <HelpPopover bodyContent="We use these default values to deploy this component. You can customize the values for each of your environments later by editing the component settings." />
              }
            />
            <SecretSection />
          </FormSection>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};
