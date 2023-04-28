import * as React from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  FormSection,
  Spinner,
  Title,
  EmptyStateBody,
  Divider,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Badge,
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { FULL_APPLICATION_TITLE } from '../../../consts/labels';
import { HeadTitle } from '../../HeadTitle';
import ApplicationSection from '../ApplicationSection/ApplicationSection';
import GitImportErrors from '../GitImportErrors';
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
    },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();
  const cachedComponents = React.useRef([]);
  const cachedComponentsLoaded = React.useRef(false);
  const isContainerImage = containerImageRegex.test(sourceUrl);

  const [detectedComponents, detectionLoaded, detectionError] = useComponentDetection(
    !isContainerImage ? sourceUrl : null,
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
      <HeadTitle>Import - Configure components | {FULL_APPLICATION_TITLE}</HeadTitle>
      <Flex direction={{ default: 'column', lg: 'row' }}>
        <Flex flex={{ default: 'flex_1' }} direction={{ default: 'column' }}>
          <FlexItem>
            <Title size="md" headingLevel="h4" className="pf-u-mt-lg pf-u-mb-lg">
              Application details
            </Title>
          </FlexItem>
          <FlexItem>
            <ApplicationSection />
          </FlexItem>
        </Flex>
        <Divider
          orientation={{
            default: 'vertical',
          }}
        />
        <Flex flex={{ default: 'flex_4' }} direction={{ default: 'column' }}>
          <FlexItem>
            <Title size="md" headingLevel="h4">
              Components <Badge isRead>{cachedComponents.current.length}</Badge>
            </Title>
            <HelperText className="pf-u-mb-sm">
              <HelperTextItem>
                A component is an image built from source code in a repository. One or more
                components that run together form an application.
              </HelperTextItem>
            </HelperText>
          </FlexItem>
          <FlexItem>
            <FormSection>
              {cachedComponents.current.map((component, index) => (
                <ReviewComponentCard
                  key={component.componentStub.componentName}
                  detectedComponent={component}
                  detectedComponentIndex={index}
                  isExpanded={index === 0}
                  showRuntimeSelector
                />
              ))}
            </FormSection>
            <GitImportErrors />
          </FlexItem>
        </Flex>
      </Flex>
    </>
  );
};

export default ReviewSection;
