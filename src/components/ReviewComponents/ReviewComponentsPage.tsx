import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
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
  const history = useHistory();

  const initialValues: ReviewComponentsFormValues = {
    deployMethod: DeployMethod.AutomaticDeploy,
    components: formState.components.reduce(
      (acc, val) => ({
        ...acc,
        [val.name]: {
          name: val.name
            .split(/ |\.|:/)
            .join('-')
            .toLowerCase(),
          source: {
            ...(val.data?.source?.git?.url || val.attributes?.git
              ? {
                  git: {
                    url: val.data?.source?.git?.url || val.attributes.git.remotes.origin,
                    devfileUrl: val.data?.source?.git.devfileUrl,
                  },
                }
              : val.data?.source),
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
      createResources(formState, data.components)
        .then((appName) => {
          history.push(`/app-studio/applications?name=${appName}`);
        })
        .catch(() => {
          setSubmitting(false);
        });
    },
    [formState, history],
  );

  return (
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
  );
};
