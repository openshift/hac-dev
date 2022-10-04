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
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
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
          Detecting Components
        </Title>
      </EmptyState>
    </Bullseye>
  );
};

const ReviewSection: React.FunctionComponent = () => {
  const {
    values: { source, secret, application, git, isDetected },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();
  const cachedComponents = React.useRef([]);
  const cachedComponentsLoaded = React.useRef(false);
  const isContainerImage = containerImageRegex.test(source);

  const [detectedComponents, detectionLoaded] = useComponentDetection(
    !isContainerImage ? source : null,
    application,
    secret,
    git.context,
    git.ref,
  );

  React.useEffect(() => {
    let unmounted = false;
    let components;

    if (unmounted) return;

    setFieldValue('isDetected', false);

    if (isContainerImage) {
      const sourceItems = source.split('/');
      const containerImageName = sourceItems[sourceItems.length - 1];
      const componentName = containerImageName.split(':').join('-');
      components = {
        [componentName]: {
          componentStub: {
            componentName,
            containerImage: source,
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
            source: { git: { url: source } },
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
  }, [application, detectedComponents, detectionLoaded, isContainerImage, setFieldValue, source]);

  if (!cachedComponentsLoaded.current) {
    return <ComponentLoadingState />;
  }

  return (
    <>
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
      </FormSection>
    </>
  );
};

export default ReviewSection;
