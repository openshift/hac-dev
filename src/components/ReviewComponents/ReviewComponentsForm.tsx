import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Form,
  FormSection,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import { DetectedComponentData, useFormValues } from '../form-context';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import PageLayout from '../PageLayout/PageLayout';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewSourceComponentCard } from './ReviewSourceComponentCard';

type ReviewComponentsFormProps = FormikProps<{}> & {
  detectedComponents: DetectedComponentData[];
  detectedComponentsLoaded: boolean;
  detectedComponentsError: unknown;
};

const NoComponentsFound: React.FC<{ error: unknown }> = ({ error }) => (
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
);

const ComponentLoadingState: React.FC = () => {
  return (
    <EmptyState>
      <EmptyStateIcon variant="container" component={Spinner} />
      <Title size="lg" headingLevel="h4">
        Detecting Components
      </Title>
    </EmptyState>
  );
};

export const ReviewComponentsForm: React.FC<ReviewComponentsFormProps> = ({
  handleSubmit,
  isSubmitting,
  status,
  errors,
  detectedComponents,
  detectedComponentsLoaded,
  detectedComponentsError,
}) => {
  const [, setFormState] = useFormValues();
  const { handleReset: wizardHandleReset, decreaseStepBy } = useWizardContext();

  const footer = (
    <FormFooter
      submitLabel="Create"
      resetLabel="Back"
      handleReset={() => {
        decreaseStepBy(2);
      }}
      handleCancel={() => {
        wizardHandleReset();
        setFormState({});
      }}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disableSubmit={
        !detectedComponentsLoaded ||
        !!detectedComponentsError ||
        detectedComponents.length === 0 ||
        !isEmpty(errors) ||
        isSubmitting
      }
      errorMessage={status?.submitError}
    />
  );

  let reviewComponents = null;

  if (!detectedComponentsLoaded) {
    reviewComponents = <ComponentLoadingState />;
  }

  if ((detectedComponentsLoaded && detectedComponents.length === 0) || detectedComponentsError) {
    reviewComponents = <NoComponentsFound error={detectedComponentsError} />;
  }

  if (detectedComponentsLoaded && detectedComponents.length > 0 && !detectedComponentsError) {
    reviewComponents = detectedComponents.map((component) => (
      <ReviewSourceComponentCard
        key={component.name}
        component={{
          name: component.name,
          source: component.data.source,
          envs: component.data.env,
        }}
        isExpanded={detectedComponents.length === 1}
      />
    ));
  }

  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      title="Review your new components"
      description={
        <>
          Review your selections for the application.{' '}
          <HelpTopicLink topicId="create-app">Learn more</HelpTopicLink>
        </>
      }
      footer={footer}
    >
      <PageSection isFilled>
        <Form onSubmit={handleSubmit}>
          <FormSection>{reviewComponents}</FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};
