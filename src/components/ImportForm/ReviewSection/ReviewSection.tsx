import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  FormSection,
  PageSection,
  Spinner,
  Title,
  Form,
  Bullseye,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { useFormikContext } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { useComponentDetection } from '../utils/cdq-utils';
import { transformComponentValues } from '../utils/transform-utils';
import { ImportFormValues } from '../utils/types';
import { containerImageRegex } from '../utils/validation-utils';
import { ReviewComponentCard } from './ReviewComponentCard';

const ComponentEmptyState: React.FC<{ error: unknown }> = ({ error }) => (
  <Bullseye>
    <EmptyState>
      <EmptyStateIcon
        style={error ? { color: 'var(--pf-global--danger-color--100)' } : {}}
        icon={error ? ExclamationCircleIcon : SearchIcon}
      />
      <Title size="lg" headingLevel="h4">
        No Components detected
      </Title>
      <EmptyStateBody>
        {error
          ? error || (error as Error)?.message || 'Error while detecting components'
          : 'No components were detected in the source.'}
      </EmptyStateBody>
    </EmptyState>
  </Bullseye>
);

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
    values: { source, secret, application, git },
    setFieldValue,
    setStatus,
  } = useFormikContext<ImportFormValues>();
  const cachedComponents = React.useRef([]);
  const cachedComponentsLoaded = React.useRef(false);
  const isContainerImage = containerImageRegex.test(source);

  const [detectedComponents, detectionLoaded, detectionError] = useComponentDetection(
    !isContainerImage ? source : null,
    application.name,
    secret,
    git.context,
    git.ref,
  );

  React.useEffect(() => {
    let unmounted = false;
    let components;

    if (unmounted) return;

    setStatus({ isValidating: true });

    if (isContainerImage) {
      const sourceLength = source.split('/').length;
      const componentName = source.split('/')[sourceLength - 1];
      components = {
        [componentName]: {
          componentStub: {
            componentName,
            containerImage: source,
          },
        },
      };
    }

    if (!isContainerImage && detectionLoaded && detectedComponents) {
      components = detectedComponents;
    }

    if (components) {
      const transformedComponents = transformComponentValues(components);
      setFieldValue('components', transformedComponents);
      cachedComponents.current = transformedComponents;
      cachedComponentsLoaded.current = true;
      setStatus({ isValidating: false });
    }

    return () => {
      unmounted = true;
    };
  }, [detectedComponents, detectionLoaded, isContainerImage, setFieldValue, setStatus, source]);

  if (!cachedComponentsLoaded.current) {
    return <ComponentLoadingState />;
  }

  if ((cachedComponentsLoaded.current && isEmpty(cachedComponents.current)) || detectionError) {
    return <ComponentEmptyState error={detectionError} />;
  }

  return (
    <PageSection isFilled style={{ height: '100%' }}>
      <Form>
        <FormSection>
          {cachedComponents.current.map((component, index) => (
            <ReviewComponentCard
              key={component.componentStub.componentName}
              detectedComponent={component}
              detectedComponentIndex={index}
            />
          ))}
        </FormSection>
      </Form>
    </PageSection>
  );
};

export default ReviewSection;
