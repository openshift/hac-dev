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
  DropdownField,
  EditableLabelField,
  EnvironmentField,
  HelpTooltipIcon,
  InputField,
  NumberSpinnerField,
  ResourceLimitField,
} from '../../shared';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { CPUUnits, MemoryUnits, Resources } from './types';

type ReviewSourceComponentCardProps = {
  component: {
    name: string;
    source: { git: { url: string; devfileUrl?: string } };
    envs?: { name: string; value: string }[];
  };
};

export const ReviewSourceComponentCard: React.FC<ReviewSourceComponentCardProps> = ({
  component,
}) => {
  const fieldPrefix = `components[${component.name}]`;
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card isSelectable isSelected={expanded} isExpanded={expanded}>
      <CardHeader
        onExpand={() => setExpanded((v) => !v)}
        toggleButtonProps={{
          'aria-label': component.name,
          'aria-expanded': expanded,
        }}
      >
        <CardTitle>
          <Flex>
            <FlexItem spacer={{ default: 'spacer4xl' }}>
              <EditableLabelField name={`${fieldPrefix}.name`} type={TextInputTypes.text} />
              <ExternalLink href={component.source.git.url} text={component.source.git.url} />
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
          <ExpandableSection toggleText="Build configuration">
            <FormSection style={{ marginLeft: '2em' }}>
              <DropdownField
                name={`${fieldPrefix}.runtime`}
                label="Runtime"
                helpText="The software your component uses to run."
                items={[
                  { key: Resources.OpenShift, value: Resources.OpenShift },
                  { key: Resources.Kubernetes, value: Resources.Kubernetes },
                  { key: Resources.KnativeService, value: Resources.KnativeService },
                ]}
              />
              <InputField
                name={`${fieldPrefix}.buildCommand`}
                label="Build command"
                placeholder="Enter a build command"
              />
              <InputField
                name={`${fieldPrefix}.runCommand`}
                label="Run command"
                placeholder="Enter a run command"
              />
            </FormSection>
          </ExpandableSection>
          <ExpandableSection style={{ marginTop: '1em' }} toggleText="Deploy configuration">
            <FormSection style={{ marginLeft: '2em' }}>
              <Grid hasGutter>
                <GridItem span={5}>
                  <ResourceLimitField
                    name={`${fieldPrefix}.resources.cpu`}
                    unitName={`${fieldPrefix}.resources.cpuUnit`}
                    label="CPU"
                    unitOptions={CPUUnits}
                    helpText="The amount of CPU the container is guaranteed"
                  />
                </GridItem>
                <GridItem span={5}>
                  <ResourceLimitField
                    name={`${fieldPrefix}.resources.memory`}
                    unitName={`${fieldPrefix}.resources.memoryUnit`}
                    label="Memory"
                    unitOptions={MemoryUnits}
                    helpText="The amount of memory the container is guaranteed"
                  />
                </GridItem>
              </Grid>
              <ExpandableSection toggleText="Show advanced deployment options">
                <FormSection style={{ marginLeft: '2em' }}>
                  <NumberSpinnerField
                    name={`${fieldPrefix}.replicas`}
                    label="Replicas"
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
