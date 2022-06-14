import * as React from 'react';
import {
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  ExpandableSection,
  Flex,
  FlexItem,
  FormSection,
  Grid,
  GridItem,
  TextInputTypes,
} from '@patternfly/react-core';
import {
  EditableLabelField,
  EnvironmentField,
  HelpTooltipIcon,
  InputField,
  NumberSpinnerField,
  ResourceLimitField,
} from '../../shared';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentSource } from '../../types';
import { CPUUnits, MemoryUnits } from './types';

type ReviewSourceComponentCardProps = {
  component: {
    name: string;
    source: ComponentSource;
    envs?: { name: string; value: string }[];
  };
  editMode?: boolean;
  isExpanded?: boolean;
};

export const ReviewSourceComponentCard: React.FC<ReviewSourceComponentCardProps> = ({
  component,
  editMode = false,
  isExpanded = false,
}) => {
  const fieldPrefix = `components[${component.name}]`;
  const [expandedComponent, setExpandedComponent] = React.useState(isExpanded);
  const [expandedConfig, setExpandedConfig] = React.useState(true);

  return (
    <Card isSelectable isSelected={expandedComponent} isExpanded={expandedComponent}>
      <CardHeader
        onExpand={() => setExpandedComponent((v) => !v)}
        toggleButtonProps={{
          'aria-label': component.name,
          'aria-expanded': expandedComponent,
        }}
      >
        <CardTitle>
          <Flex>
            <FlexItem spacer={{ default: 'spacer4xl' }}>
              {editMode ? (
                <p>{component.name}</p>
              ) : (
                <EditableLabelField name={`${fieldPrefix}.name`} type={TextInputTypes.text} />
              )}
              <ExternalLink
                href={
                  component.source.git?.url ?? `https://${component.source.image?.containerImage}`
                }
                text={component.source.git?.url ?? component.source.image?.containerImage}
              />
            </FlexItem>
            <FlexItem>
              <EditableLabelField
                name={`${fieldPrefix}.targetPort`}
                label="Target port"
                type={TextInputTypes.number}
              />
            </FlexItem>
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody style={{ marginLeft: '2em', maxWidth: '70%' }}>
          <ExpandableSection
            isExpanded={expandedConfig}
            onToggle={() => setExpandedConfig((v) => !v)}
            toggleText="Deploy configuration"
            isIndented
          >
            <FormSection>
              <Grid hasGutter>
                <GridItem span={5}>
                  <ResourceLimitField
                    name={`${fieldPrefix}.resources.cpu`}
                    unitName={`${fieldPrefix}.resources.cpuUnit`}
                    label="CPU"
                    minValue={0}
                    unitOptions={CPUUnits}
                    helpText="The amount of CPU the container is guaranteed"
                  />
                </GridItem>
                <GridItem span={5}>
                  <ResourceLimitField
                    name={`${fieldPrefix}.resources.memory`}
                    unitName={`${fieldPrefix}.resources.memoryUnit`}
                    label="Memory"
                    minValue={0}
                    unitOptions={MemoryUnits}
                    helpText="The amount of memory the container is guaranteed"
                  />
                </GridItem>
              </Grid>
              <ExpandableSection toggleText="Show advanced deployment options">
                <FormSection>
                  <NumberSpinnerField
                    name={`${fieldPrefix}.replicas`}
                    label="Replicas"
                    min={0}
                    helpText="Number of instances of your image"
                  />
                  <InputField
                    name={`${fieldPrefix}.route`}
                    label="Route"
                    placeholder="Route exposed by the deployment"
                  />
                  <EnvironmentField
                    name={`${fieldPrefix}.env`}
                    envs={component.envs}
                    label="Environment variables"
                    description="Component will have access during build and runtimes."
                    labelIcon={
                      <HelpTooltipIcon content="Set environment variables to define the behaviour of your application environment." />
                    }
                  />
                </FormSection>
              </ExpandableSection>
            </FormSection>
          </ExpandableSection>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};
