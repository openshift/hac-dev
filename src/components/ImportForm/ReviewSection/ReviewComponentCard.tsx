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
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { InputField, CheckboxField } from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import GitRepoLink from '../../GitLink/GitRepoLink';
import SecretSection from '../SecretSection/SecretSection';
import { DetectedFormComponent, ImportFormValues } from '../utils/types';
import { ComponentForm } from './ComponentForm';
import { RuntimeSelector } from './RuntimeSelector';

import './ReviewComponentCard.scss';

type ReviewComponentCardProps = {
  detectedComponent: DetectedFormComponent;
  detectedComponentIndex: number;
  editMode?: boolean;
  isExpanded?: boolean;
  showRuntimeSelector?: boolean;
};

const ReviewComponentCard: React.FC<React.PropsWithChildren<ReviewComponentCardProps>> = ({
  detectedComponent,
  detectedComponentIndex,
  editMode = false,
  isExpanded = false,
  showRuntimeSelector,
}) => {
  const component = detectedComponent.componentStub;
  const name = component.componentName;
  const fieldPrefix = `components[${detectedComponentIndex}].componentStub`;
  const [expandedComponent, setExpandedComponent] = React.useState(isExpanded);
  const {
    values: { components },
  } = useFormikContext<ImportFormValues>();

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
        <Flex className="pf-v5-u-flex-1" direction={{ default: 'column', sm: 'row' }}>
          {!editMode && components?.length > 1 && (
            <FlexItem>
              <CheckboxField
                name={`selectedComponents[${detectedComponentIndex}]`}
                data-test={`select-component-toggle-${detectedComponentIndex}`}
              />
            </FlexItem>
          )}
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
              <GitRepoLink url={component.source.git.url} />
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
                  data-test={`${fieldPrefix}.source.git.revision`}
                  name={`${fieldPrefix}.source.git.revision`}
                  label="Git reference"
                  helpText="Optional branch, tag or commit."
                />
              </GridItem>
              <GridItem sm={12} lg={4}>
                <InputField
                  data-test={`${fieldPrefix}.source.git.context`}
                  name={`${fieldPrefix}.source.git.context`}
                  label="Build context"
                  helpText="Optional subdirectory for the component's build information."
                />
              </GridItem>
            </Grid>
            <ComponentForm
              detectedComponent={detectedComponent}
              detectedComponentIndex={detectedComponentIndex}
              editMode={editMode}
            />
            <SecretSection />
          </FormSection>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

export default ReviewComponentCard;
