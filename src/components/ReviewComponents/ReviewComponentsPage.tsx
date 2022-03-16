import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { Page } from '../../shared';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewComponentsForm } from './ReviewComponentsForm';
import { createResources } from './submit-utils';
import { DeployMethod, Resources, ReviewComponentsFormValues } from './types';
import { createResourceData } from './utils';
import { reviewFormSchema } from './validation-utils';

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
          name: val.name.split(/ |\./).join('-').toLowerCase(),
          source: {
            git: {
              url: val.data?.source?.git.url || val.attributes.git.remotes.origin,
              devfileUrl: val.data?.source?.git.devfileUrl,
            },
          },
          ...(isSample
            ? {}
            : {
                runtime: Resources.OpenShift,
                resources: createResourceData(val.data.resources || {}),
                replicas: val.data.replicas || 1,
                targetPort: val.data.targetPort || 8080,
                route: val.data.route,
                env: val.data.env,
              }),
        },
      }),
      {},
    ),
  };

  const handleSubmit = React.useCallback(
    (data: ReviewComponentsFormValues, { setSubmitting }) => {
      createResources(formState, data.components, dispatch)
        .then((appName) => {
          history.push(`/components?application=${appName}`);
        })
        .catch(() => {
          setSubmitting(false);
        });
    },
    [formState, dispatch, history],
  );

  return (
    <Page
      breadcrumbs={[
        { path: '/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Review your new components"
      description="Review your selections for the application."
    >
      <Formik
        onSubmit={handleSubmit}
        onReset={() => {
          decreaseStepBy(isSample ? 1 : 2);
        }}
        initialValues={initialValues}
        validationSchema={reviewFormSchema}
      >
        {(props) => <ReviewComponentsForm {...props} />}
      </Formik>
    </Page>
  );
};
