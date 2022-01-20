import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { createApplication, createComponent } from '../../utils/create-utils';
import { useFormValues } from '../form-context';
import { Page } from '../Page/Page';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewComponentsForm } from './ReviewComponentsForm';
import { DeployMethod, Resources, ReviewComponentsFormValues } from './types';
import { createResourceData } from './utils';

export const ReviewComponentsPage: React.FC = () => {
  const { decreaseStepBy } = useWizardContext();
  const [formState] = useFormValues();
  const isSample = formState.components[0].type === 'sample';
  const dispatch = useDispatch();

  const initialValues: ReviewComponentsFormValues = {
    deployMethod: DeployMethod.AutomaticDeploy,
    components: formState.components.reduce(
      (acc, val) => ({
        ...acc,
        [val.name]: {
          name: val.name,
          source: val.data?.source || val.attributes.git.remotes.origin,
          ...(isSample
            ? {}
            : {
                runtime: Resources.OpenShift,
                resources: createResourceData(val.data.resources),
                replicas: 3,
                targetPort: 8080,
              }),
        },
      }),
      {},
    ),
  };

  const handleSubmit = React.useCallback(
    (data: ReviewComponentsFormValues) => {
      createApplication(formState.application, formState.namespace)
        .then((applicationData) => {
          // eslint-disable-next-line no-console
          console.log('###############- Application created', applicationData);
          return Promise.all(
            Object.entries(data.components).map(([name, component]) => {
              return createComponent(
                {
                  name,
                  gitRepo: component.source,
                },
                applicationData?.metadata?.name,
                formState.namespace,
              );
            }),
          )
            .then((componentData) => {
              // eslint-disable-next-line no-console
              console.log('###############- Components created', componentData);
              dispatch(
                addNotification({
                  variant: 'success',
                  title: 'Application and components created successfully!!',
                  description: `Created application ${
                    formState.application
                  } with components ${formState.components.map((c) => c.name).join(', ')}`,
                }),
              );
            })
            .catch((error) => {
              dispatch(
                addNotification({
                  variant: 'danger',
                  title: 'Component creation failed!!',
                  description: error.message,
                }),
              );
            });
        })
        .catch((error) => {
          dispatch(
            addNotification({
              variant: 'danger',
              title: 'Application creation failed!!',
              description: error.message,
            }),
          );
        });
    },
    [formState, dispatch],
  );

  return (
    <Page
      breadcrumbs={[
        { path: '#', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Review your new components"
      description="Review your choices for the application."
    >
      <Formik
        onSubmit={handleSubmit}
        onReset={() => {
          decreaseStepBy(isSample ? 1 : 2);
        }}
        initialValues={initialValues}
      >
        {(props) => <ReviewComponentsForm {...props} />}
      </Formik>
    </Page>
  );
};
