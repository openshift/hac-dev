import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewComponentsForm } from './ReviewComponentsForm';
import { createResources } from './submit-utils';
import { ReviewComponentsFormValues } from './types';
import { transformComponentValues } from './utils';
import { reviewFormSchema } from './validation-utils';

export const ReviewComponentsPage: React.FC = () => {
  const { decreaseStepBy } = useWizardContext();
  const [formState] = useFormValues();
  const isSample = formState.components[0].type === 'sample';
  const history = useHistory();

  // const name = searchTerm.split('/')?.[2];
  // setFieldValue('detectedComponents', [
  //   { source: { image: { containerImage: searchTerm } }, name },
  // ]);

  const initialValues: ReviewComponentsFormValues = {
    components: transformComponentValues(formState.components),
  };

  const handleSubmit = React.useCallback(
    (data: ReviewComponentsFormValues, actions) => {
      createResources(formState, data.components)
        .then((appName) => {
          history.push(`/app-studio/applications?name=${appName}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          actions.setSubmitting(false);
          actions.setStatus({ submitError: error.message });
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
