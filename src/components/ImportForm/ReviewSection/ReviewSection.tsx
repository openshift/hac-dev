import * as React from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  FormSection,
  Spinner,
  Title,
  HelperText,
  TextContent,
  Text,
  HelperTextItem,
  EmptyStateBody,
  FormGroup,
} from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { useFormikContext } from 'formik';
import { RadioButtonField } from '../../../shared';
import { HeadTitle } from '../../HeadTitle';
import { HelpTopicLink } from '../../HelpTopicLink/HelpTopicLink';
import { useComponentDetection } from '../utils/cdq-utils';
import { transformComponentValues } from '../utils/transform-utils';
import { ImportFormValues } from '../utils/types';
import { containerImageRegex } from '../utils/validation-utils';
import { ReviewComponentCard } from './ReviewComponentCard';

const ComponentLoadingState: React.FC = () => {
  return (
    <EmptyState>
      <EmptyStateIcon variant="container" component={Spinner} />
      <Title size="lg" headingLevel="h4">
        Detecting
      </Title>
      <EmptyStateBody>
        Sit tight while we determine your application&apos;s runtime and other settings to configure
        its build and deployment. This should only take a moment.
      </EmptyStateBody>
    </EmptyState>
  );
};

const ReviewSection: React.FunctionComponent = () => {
  const {
    values: {
      source: {
        git: { url: sourceUrl, revision, context },
      },
      secret,
      application,
      isDetected,
    },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();
  const cachedComponents = React.useRef([]);
  const cachedComponentsLoaded = React.useRef(false);
  const isContainerImage = containerImageRegex.test(sourceUrl);

  const [detectedComponents, detectionLoaded, detectionError] = useComponentDetection(
    !isContainerImage ? sourceUrl : null,
    application,
    secret,
    context,
    revision,
  );

  React.useEffect(() => {
    let unmounted = false;
    let components;

    if (unmounted) return;

    setFieldValue('isDetected', false);
    setFieldValue('detectionFailed', false);

    if (isContainerImage) {
      const sourceItems = sourceUrl.split('/');
      const containerImageName = sourceItems[sourceItems.length - 1];
      const componentName = containerImageName.split(':').join('-');
      components = {
        [componentName]: {
          componentStub: {
            componentName,
            containerImage: sourceUrl,
          },
        },
      };
      cachedComponentsLoaded.current = true;
    }

    if (!isContainerImage && (detectionLoaded || detectionError)) {
      if (detectedComponents) {
        components = detectedComponents;
      }
      cachedComponentsLoaded.current = true;
    }

    if (components) {
      const transformedComponents = transformComponentValues(components);
      setFieldValue('isDetected', true);

      setFieldValue('detectedComponents', transformedComponents);
      setFieldValue('components', transformedComponents);
      cachedComponents.current = transformedComponents;
    }

    if ((detectionLoaded || detectionError) && !components) {
      const transformedComponents = transformComponentValues({
        myComponent: {
          componentStub: {
            componentName: 'my-component',
            application,
            source: { git: { url: sourceUrl, revision, context } },
          },
        },
      });

      setFieldValue('detectedComponents', undefined);
      setFieldValue('components', transformedComponents);
      cachedComponents.current = transformedComponents;
      setFieldValue('isDetected', false);
      setFieldValue('detectionFailed', true);
    }

    setFieldValue('initialDetectionLoaded', detectionLoaded || detectionError);
    return () => {
      unmounted = true;
    };
  }, [
    application,
    detectedComponents,
    detectionLoaded,
    detectionError,
    isContainerImage,
    setFieldValue,
    sourceUrl,
    revision,
    context,
  ]);

  if (!cachedComponentsLoaded.current) {
    return <ComponentLoadingState />;
  }

  return (
    <>
      <HeadTitle>Import - Configure components | CI/CD</HeadTitle>
      <TextContent>
        <Text component="h2">Configure your components for deployment</Text>
        <HelperText>
          <HelperTextItem>
            Review and define deployment settings and options.{' '}
            <HelpTopicLink topicId="stonesoup-import-configure-component" isInline>
              Learn more <span className="pf-u-screen-reader">about configuring components</span>{' '}
              <OpenDrawerRightIcon />
            </HelpTopicLink>
          </HelperTextItem>
        </HelperText>
      </TextContent>
      <FormSection>
        {cachedComponents.current.map((component, index) => (
          <ReviewComponentCard
            key={component.componentStub.componentName}
            detectedComponent={component}
            detectedComponentIndex={index}
            isExpanded={!isDetected}
            showRuntimeSelector
          />
        ))}

        <FormGroup label="Build pipeline">
          <RadioButtonField
            name="pipelinesascode"
            aria-label="Default"
            label="Default"
            description="Manually trigger rebuilds from the Application screen."
            value="manual"
          />
          <RadioButtonField
            name="pipelinesascode"
            aria-label="Custom"
            label="Custom"
            description="Customize build pipeline in your component's repository to automatically trigger rebuilds."
            value="automatic"
            data-test="custom-build-pipelines"
          />
        </FormGroup>
      </FormSection>
    </>
  );
};

export default ReviewSection;
