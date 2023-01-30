import * as React from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  FormSection,
  Spinner,
  Title,
  Bullseye,
  HelperText,
  TextContent,
  Text,
  HelperTextItem,
  EmptyStateBody,
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { CheckboxField } from '../../../shared';
import { HeadTitle } from '../../HeadTitle';
import { HelpTopicLink } from '../../HelpTopicLink/HelpTopicLink';
import { useComponentDetection } from '../utils/cdq-utils';
import { transformComponentValues } from '../utils/transform-utils';
import { ImportFormValues } from '../utils/types';
import { containerImageRegex } from '../utils/validation-utils';
import { ReviewComponentCard } from './ReviewComponentCard';

const ComponentLoadingState: React.FC = () => {
  return (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon variant="container" component={Spinner} />
        <Title size="lg" headingLevel="h4">
          Detecting
        </Title>
        <EmptyStateBody>
          We&apos;re scanning your GitHub repo to determine runtime and other default settings. This
          might take some time.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
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

  const [detectedComponents, detectionLoaded] = useComponentDetection(
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

    if (!isContainerImage && detectionLoaded) {
      if (detectedComponents) {
        components = detectedComponents;
      }
      cachedComponentsLoaded.current = true;
    }

    if (components) {
      const transformedComponents = transformComponentValues(components);
      setFieldValue('isDetected', true);
      setFieldValue('components', transformedComponents);
      cachedComponents.current = transformedComponents;
    }

    if (detectionLoaded && !components) {
      const transformedComponents = transformComponentValues({
        myComponent: {
          componentStub: {
            componentName: 'my-component',
            application,
            source: { git: { url: sourceUrl } },
          },
        },
      });
      setFieldValue('components', transformedComponents);
      cachedComponents.current = transformedComponents;
      setFieldValue('isDetected', false);
      setFieldValue('detectionFailed', true);
    }

    return () => {
      unmounted = true;
    };
  }, [
    application,
    detectedComponents,
    detectionLoaded,
    isContainerImage,
    setFieldValue,
    sourceUrl,
  ]);

  if (!cachedComponentsLoaded.current) {
    return <ComponentLoadingState />;
  }

  return (
    <>
      <HeadTitle>Import - Configure components | Stonesoup</HeadTitle>
      <TextContent>
        <Text component="h2">Configure your components for deployment</Text>
        <HelperText>
          <HelperTextItem>
            Review and define deployment settings and options.{' '}
            <HelpTopicLink topicId="create-app-config">Learn more</HelpTopicLink>
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

        <CheckboxField
          name="pipelinesascode"
          aria-label="Send pull request"
          label="Send pull request"
          helpText="This will create a custom pipeline in your repository."
          data-test="send-pull-request"
        />
      </FormSection>
    </>
  );
};

export default ReviewSection;
