import * as React from 'react';
import { Form, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { FormikProps, useField } from 'formik';
import isEmpty from 'lodash-es/isEmpty';
import PageLayout from '../../../../components/PageLayout/PageLayout';
import { FormFooter, TextAreaField } from '../../../../shared';
import KeyValueField from '../../../../shared/components/formik-fields/key-value-input-field/KeyValueInputField';
import { useWorkspaceBreadcrumbs } from '../../../../utils/breadcrumb-utils';
import { ReleasePlanFormValues } from '../ReleasePlanForm/form-utils';
import { ReleasePlanDropdown } from './ReleasePlanDropdown';
import { SnapshotDropdown } from './SnapshotDropdown';

type Props = FormikProps<ReleasePlanFormValues> & {
  edit?: boolean;
};

export const TriggerReleaseForm: React.FC<Props> = ({
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
      title="Trigger release plan"
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
          submitLabel="Trigger"
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
          <ReleasePlanDropdown
            name="release"
            helpText="The release you want to release to the environments in your target workspace."
            required
          />
          <SnapshotDropdown
            name="snapshot"
            helpText="The release you want to release to the environments in your target workspace."
            required
          />
          <TextAreaField
            name="synopsis"
            label="Synopsis"
            helpText="What is the content and purpose of this release?"
          />
          <TextAreaField
            name="topic"
            label="Topic"
            helpText="What topics are related to this release? Such as osp-director-downloader-container or osp-director-agent-container"
          />
          <TextAreaField
            name="description"
            label="Description"
            helpText="Provide data related to a release pipeline."
          />
          <TextAreaField
            name="solution"
            label="Solution"
            helpText="Provide data related to a release pipeline."
          />
          <TextAreaField
            name="references"
            label="References"
            helpText="Provide atleast 1 URL. Sparate URLs by commas"
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
