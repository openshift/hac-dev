import * as React from 'react';
import {
  FormSection,
  Spinner,
  Title,
  Divider,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Backdrop,
  Bullseye,
  Card,
  CardBody,
  Label,
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import gitUrlParse from 'git-url-parse';
import { FULL_APPLICATION_TITLE } from '../../../consts/labels';
import { HeadTitle } from '../../../shared/components/HeadTitle';
import ApplicationSection from '../ApplicationSection/ApplicationSection';
import GitImportErrors from '../GitImportErrors';
import { useComponentDetection } from '../utils/cdq-utils';
import { transformComponentValues } from '../utils/transform-utils';
import { ImportFormValues } from '../utils/types';
import { useValidApplicationName } from '../utils/useValidApplicationName';
import { containerImageRegex, gitUrlRegex } from '../utils/validation-utils';
import ReviewComponentCard from './ReviewComponentCard';

const ComponentLoadingState: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Backdrop>
      <Bullseye>
        <Card isRounded isCompact>
          <CardBody>
            <Bullseye style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              <Spinner size="lg" />
            </Bullseye>
            <HelperText>
              <HelperTextItem variant="indeterminate">Detecting values...</HelperTextItem>
            </HelperText>
          </CardBody>
        </Card>
      </Bullseye>
    </Backdrop>
  );
};

const ReviewSection: React.FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const {
    values: {
      application,
      inAppContext,
      source: {
        git: { url: sourceUrl, revision, context },
      },
      secret,
      resourceLimits: { min: defaultResourceLimits } = {},
      selectedComponents,
    },
    errors: { selectedComponents: selectedComponentsError },
    isSubmitting,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<ImportFormValues>();
  const cachedComponents = React.useRef([]);
  const cachedComponentsLoaded = React.useRef(false);
  const isContainerImage = containerImageRegex.test(sourceUrl);

  const source = React.useMemo(
    () => (!isContainerImage ? gitUrlParse(sourceUrl).toString() : null),
    [isContainerImage, sourceUrl],
  );

  const [detectedComponents, detectionLoaded, detectionError] = useComponentDetection(
    source,
    secret,
    context,
    revision,
  );

  const [validAppName] = useValidApplicationName(sourceUrl);

  React.useEffect(() => {
    if (
      sourceUrl &&
      gitUrlRegex.test(sourceUrl.trim()) &&
      !inAppContext &&
      !isSubmitting &&
      // we only need to set app when it's unset and not when it's cleared
      application === undefined
    ) {
      setFieldValue('application', validAppName);
    }
  }, [sourceUrl, inAppContext, validAppName, setFieldValue, isSubmitting, application]);

  React.useEffect(() => {
    let unmounted = false;
    let components;
    let selectedComponentsArray;

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
      const transformedComponents = transformComponentValues(
        components,
        null,
        defaultResourceLimits,
      );
      setFieldValue('isDetected', true);

      selectedComponentsArray = new Array(transformedComponents.length).fill(true);

      setFieldValue('detectedComponents', transformedComponents, true);
      setFieldValue('components', transformedComponents, true);
      setFieldValue('selectedComponents', selectedComponentsArray);
      cachedComponents.current = transformedComponents;
    }

    if ((detectionLoaded || detectionError) && !components) {
      const transformedComponents = transformComponentValues(
        {
          myComponent: {
            componentStub: {
              componentName: 'my-component',
              application: 'my-app',
              source: { git: { url: sourceUrl, revision, context, dockerfileUrl: 'Dockerfile' } },
            },
          },
        },
        null,
        defaultResourceLimits,
      );

      selectedComponentsArray = new Array(transformedComponents.length).fill(true);

      setFieldValue('detectedComponents', undefined);
      setFieldValue('components', transformedComponents);
      setFieldValue('selectedComponents', selectedComponentsArray);
      cachedComponents.current = transformedComponents;
      setFieldValue('isDetected', false);
      setFieldValue('detectionFailed', true);
    }

    setFieldValue('initialDetectionLoaded', detectionLoaded || detectionError);
    return () => {
      unmounted = true;
    };
  }, [
    detectedComponents,
    detectionLoaded,
    detectionError,
    isContainerImage,
    setFieldValue,
    sourceUrl,
    revision,
    context,
    setFieldTouched,
    defaultResourceLimits,
  ]);

  const selectedComponentsCount = React.useMemo(
    () => selectedComponents?.filter(Boolean).length ?? 0,
    [selectedComponents],
  );

  if (!cachedComponentsLoaded.current) {
    return <ComponentLoadingState />;
  }

  return (
    <>
      <HeadTitle>Import - Configure components | {FULL_APPLICATION_TITLE}</HeadTitle>
      <Flex direction={{ default: 'column', lg: 'row' }}>
        <Flex flex={{ default: 'flex_1' }} direction={{ default: 'column' }}>
          <FlexItem>
            <Title size="md" headingLevel="h4" className="pf-v5-u-mt-lg pf-v5-u-mb-lg">
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
              Components{' '}
              <Label isCompact color={selectedComponentsError ? 'red' : 'grey'}>
                {cachedComponents.current.length > 1 ? (
                  <>
                    {selectedComponentsCount} of {cachedComponents.current.length} selected
                  </>
                ) : (
                  cachedComponents.current.length
                )}
              </Label>
            </Title>
            <HelperText className="pf-v5-u-mb-sm">
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
