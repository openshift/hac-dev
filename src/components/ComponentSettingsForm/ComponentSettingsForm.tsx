import React from 'react';
import { PageSection, FormSection, Form } from '@patternfly/react-core';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ReviewComponentCard } from '../ImportForm/ReviewSection/ReviewComponentCard';
import PageLayout from '../PageLayout/PageLayout';

import '../../shared/style.scss';

const ComponentSettingsForm: React.FunctionComponent<FormikProps<FormikValues>> = ({
  handleSubmit,
  handleReset,
  isSubmitting,
  status,
  errors,
}) => {
  const {
    values: { components },
  } = useFormikContext<FormikValues>();
  const { workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();

  const footer = (
    <FormFooter
      submitLabel="Save"
      handleCancel={handleReset}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disableSubmit={!isEmpty(errors) || isSubmitting}
      errorMessage={status?.submitError}
    />
  );

  return (
    <PageLayout
      breadcrumbs={[
        ...applicationBreadcrumbs,
        {
          path: `/application-pipeline/workspaces/${workspace}/applications/${components[0].componentStub.application}/components`,
          name: components[0].componentStub.componentName,
        },
        { path: '#', name: 'Component settings' },
      ]}
      title="Component settings"
      description="View and edit component settings. Updates will take effect when the component is redeployed."
      footer={footer}
    >
      <PageSection isFilled>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            {components.map((component) => (
              <ReviewComponentCard
                key={component.componentStub.componentName}
                detectedComponent={component}
                detectedComponentIndex={0}
                isExpanded
                editMode
              />
            ))}
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};

export default ComponentSettingsForm;
