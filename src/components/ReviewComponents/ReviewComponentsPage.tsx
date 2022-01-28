import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { createApplication, createComponent } from '../../utils/create-utils';
import { useFormValues } from '../form-context';
import { Page } from '../Page/Page';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewComponentsForm } from './ReviewComponentsForm';
import { DeployMethod, Resources, ReviewComponentsFormValues } from './types';
import { createResourceData, transformResources } from './utils';

export const ReviewComponentsPage: React.FC = () => {
  const { decreaseStepBy } = useWizardContext();
  const [formState] = useFormValues();
  const isSample = formState.components[0].type === 'sample';
  const dispatch = useDispatch();
  const history = useHistory();

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
    (data: ReviewComponentsFormValues, { setSubmitting }) => {
      let appName: string, successful: boolean;
      const createResources = async () => {
        if (!formState.existingApplication) {
          const applicationData = await createApplication(
            formState.application,
            formState.namespace,
          );
          appName = applicationData.metadata.name;
          // eslint-disable-next-line no-console
          console.log('###############- Application created', applicationData);
        } else {
          appName = formState.existingApplication;
        }
        await Promise.all(
          Object.values(data.components).map((component) => {
            return createComponent(
              {
                name: component.name,
                gitRepo: component.source,
                replicas: component.replicas && Number(component.replicas),
                targetPort: component.targetPort && Number(component.targetPort),
                resources: component.resources && transformResources(component.resources),
              },
              appName,
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
                description: `Created application ${appName} with components ${formState.components
                  .map((c) => c.name)
                  .join(', ')}`,
              }),
            );
            successful = true;
          })
          .catch((error) => {
            dispatch(
              addNotification({
                variant: 'danger',
                title: 'Component creation failed!!',
                description: error.message,
              }),
            );
            setSubmitting(false);
          });
      };
      createResources()
        .then(() => {
          if (successful) history.push(`/components?application=${appName}`);
        })
        .catch((error) => {
          dispatch(
            addNotification({
              variant: 'danger',
              title: 'Application creation failed!!',
              description: error.message,
            }),
          );
          setSubmitting(false);
        });
    },
    [formState, dispatch, history],
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
