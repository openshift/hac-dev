import React from 'react';
import { useParams } from 'react-router-dom';
import { PageSection, FormSection, Form, Flex, FlexItem } from '@patternfly/react-core';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import GitRepoLink from '../GitLink/GitRepoLink';
import { ComponentForm } from '../ImportForm/ReviewSection/ComponentForm';
import PageLayout from '../PageLayout/PageLayout';

import './DeploymentSettingsForm.scss';

const DeploymentSettingsForm: React.FunctionComponent<
  React.PropsWithChildren<FormikProps<FormikValues>>
> = ({ handleSubmit, handleReset, isSubmitting, status, errors }) => {
  const {
    values: { components },
  } = useFormikContext<FormikValues>();
  const { workspace } = useWorkspaceInfo();
  const params = useParams();
  const { componentName, appName } = params;
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const component = components[0].componentStub;

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
          path: `/application-pipeline/workspaces/${workspace}/applications/${appName}/components`,
          name: 'components',
        },
        {
          path: `/application-pipeline/workspaces/${workspace}/applications/${appName}/components/${componentName}`,
          name: componentName,
        },
        {
          path: '#',
          name: 'Edit deployment settings',
        },
      ]}
      title="Edit deployment settings"
      description={
        <div>
          <Flex spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>{componentName} component</FlexItem>
            <FlexItem>
              {component.source?.git?.url ? (
                <GitRepoLink
                  url={component.source.git.url}
                  revision={component.source.git.revision}
                  context={component.source.git.context}
                />
              ) : (
                <ExternalLink
                  href={
                    component.containerImage?.includes('http')
                      ? component.containerImage
                      : `https://${component.containerImage}`
                  }
                  text={component.containerImage}
                />
              )}
            </FlexItem>
          </Flex>
          <div className="deployment-settings__details-description">
            Updates will take effect when the deployment is redeployed.
          </div>
        </div>
      }
      footer={footer}
    >
      <PageSection isFilled variant="light">
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <ComponentForm detectedComponent={components[0]} detectedComponentIndex={0} editMode />
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};

export default DeploymentSettingsForm;
