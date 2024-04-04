import * as React from 'react';
import { Form, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { FormikProps, useField } from 'formik';
import isEmpty from 'lodash-es/isEmpty';
import PageLayout from '../../../../components/PageLayout/PageLayout';
import { FormFooter, TextAreaField } from '../../../../shared';
import KeyValueField from '../../../../shared/components/formik-fields/key-value-input-field/KeyValueInputField';
import { useWorkspaceBreadcrumbs } from '../../../../utils/breadcrumb-utils';
import { IssueType } from './AddIssueSection/AddIssueModal';
import { AddIssueSection } from './AddIssueSection/AddIssueSection';
import { TriggerReleaseFormValues } from './form-utils';
import { ReleasePlanDropdown } from './ReleasePlanDropdown';
import { SnapshotDropdown } from './SnapshotDropdown';

type Props = FormikProps<TriggerReleaseFormValues> & { applicationName: string };

export const TriggerReleaseForm: React.FC<Props> = ({
  handleSubmit,
  handleReset,
  isSubmitting,
  dirty,
  errors,
  status,
  applicationName,
}) => {
  const breadcrumbs = useWorkspaceBreadcrumbs();

  const [{ value: labels }] = useField<TriggerReleaseFormValues['labels']>('labels');

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
          name: 'Trigger release plan',
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
            name="releasePlan"
            helpText="The release you want to release to the environments in your target workspace."
            required
          />
          <SnapshotDropdown
            name="snapshot"
            helpText="The release you want to release to the environments in your target workspace."
            required
            applicationName={applicationName}
          />
          <AddIssueSection field="issues" issueType={IssueType.BUG} />

          <AddIssueSection field="cves" issueType={IssueType.CVE} />

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

          <TextAreaField name="description" label="Description" />
          <TextAreaField name="solution" label="Solution" />
          <TextAreaField
            name="references"
            label="References"
            helpText="Please enter at least 1 reference"
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
