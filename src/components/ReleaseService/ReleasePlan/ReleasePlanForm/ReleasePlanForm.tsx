import * as React from 'react';
import { Form, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { FormikProps, useField } from 'formik';
import isEmpty from 'lodash-es/isEmpty';
import HelpPopover from '../../../../components/HelpPopover';
import PageLayout from '../../../../components/PageLayout/PageLayout';
import { ApplicationDropdown } from '../../../../components/Secrets/SecretsForm/ApplicationDropdown';
import { FormFooter, InputField, SwitchField } from '../../../../shared';
import KeyValueField from '../../../../shared/components/formik-fields/key-value-input-field/KeyValueInputField';
import { useWorkspaceBreadcrumbs } from '../../../../utils/breadcrumb-utils';
import { ReleasePlanFormValues } from './form-utils';
import { RunReleasePipelineSection } from './RunReleasePipelineSection';

type Props = FormikProps<ReleasePlanFormValues> & {
  edit?: boolean;
};

export const ReleasePlanForm: React.FC<Props> = ({
  handleSubmit,
  handleReset,
  isSubmitting,
  dirty,
  errors,
  status,
  edit,
}) => {
  const breadcrumbs = useWorkspaceBreadcrumbs();
  const [{ value: labels }] = useField<ReleasePlanFormValues['labels']>('labels');

  return (
    <PageLayout
      title={edit ? 'Edit release plan' : 'Create release plan'}
      description="A release plan schedules when to send your code to production."
      breadcrumbs={[
        ...breadcrumbs,
        {
          path: `/application-pipeline/release`,
          name: 'Releases',
        },
        {
          path: '#',
          name: edit ? 'Edit release plan' : 'Create release plan',
        },
      ]}
      footer={
        <FormFooter
          submitLabel={edit ? 'Save' : 'Create'}
          handleCancel={handleReset}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
          errorMessage={status?.submitError}
        />
      }
    >
      <PageSection variant={PageSectionVariants.light} isFilled isWidthLimited>
        <Form style={{ maxWidth: '70%' }}>
          <InputField
            name="name"
            label="Release plan name"
            placeholder="Enter name"
            isDisabled={edit}
            required
          />
          <ApplicationDropdown
            name="application"
            helpText="The application you want to release to the environments in your target workspace."
            required
          />
          <RunReleasePipelineSection />
          <SwitchField
            name="autoRelease"
            formLabel="Auto release"
            labelIcon={
              <HelpPopover
                headerContent="Auto release"
                bodyContent="Your application will trigger the release every time a snapshot is created."
              />
            }
          />
          <SwitchField
            name="standingAttribution"
            formLabel="Standing attribution"
            labelIcon={
              <HelpPopover
                headerContent="Standing attribution"
                bodyContent="The author of the release plan will be provided as the standing attribution for releases."
              />
            }
          />
          <KeyValueField
            name="labels"
            label="Labels"
            description="You can add labels to provide more context or tag your release plan."
            entries={labels}
          />
        </Form>
      </PageSection>
    </PageLayout>
  );
};
