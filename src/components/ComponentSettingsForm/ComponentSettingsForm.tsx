import React from 'react';
import { PageSection, FormSection, Form } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import { FormFooter } from '../../shared';
import { ComponentKind } from '../../types';
import PageLayout from '../PageLayout/PageLayout';
import { ReviewSourceComponentCard } from '../ReviewComponents/ReviewSourceComponentCard';

import '../../shared/style.scss';

type ComponentSettingsFormProps = { component: ComponentKind } & FormikProps<{}>;

const ComponentSettingsForm: React.FunctionComponent<ComponentSettingsFormProps> = ({
  component,
  handleSubmit,
  handleReset,
  isSubmitting,
  status,
  errors,
}) => {
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
        { path: '/app-studio/applications', name: 'Applications' },
        {
          path: `/app-studio/applications?name=${component.spec.application}`,
          name: startCase(component.spec.application),
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
            <ReviewSourceComponentCard
              component={{
                name: component.metadata.name,
                source: component.spec.source,
                envs: component.spec.env,
              }}
              isExpanded
              editMode
            />
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};

export default ComponentSettingsForm;
