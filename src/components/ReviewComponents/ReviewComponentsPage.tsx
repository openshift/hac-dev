import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { mapDetectedComponents, useComponentDetection } from '../AddComponent/utils';
import { containerImageRegex } from '../AddComponent/validation-utils';
import { DetectedComponentData, useFormValues } from '../form-context';
import { ReviewComponentsForm } from './ReviewComponentsForm';
import { createResources } from './submit-utils';
import { ReviewComponentsFormValues } from './types';
import { transformComponentValues } from './utils';
import { reviewFormSchema } from './validation-utils';

export const ReviewComponentsPage: React.FC = () => {
  const [formState] = useFormValues();
  const navigate = useNavigate();

  const isContainerImage = containerImageRegex.test(formState.source);

  const [detectedComponents, loadError] = useComponentDetection(
    !isContainerImage ? formState.source : null,
    formState.application,
    formState.git,
  );

  const [components, loaded, detectionError]: [DetectedComponentData[], boolean, string] =
    React.useMemo(() => {
      if (isContainerImage) {
        const sourceLength = formState.source.split('/').length;
        return [
          [
            {
              data: { source: { image: { containerImage: formState.source } } },
              name: formState.source.split('/')?.[sourceLength - 1],
            },
          ] as DetectedComponentData[],
          true,
          null,
        ];
      }
      if (detectedComponents && !loadError) {
        return [mapDetectedComponents(detectedComponents), true, null];
      }
      if (loadError) {
        return [[], true, loadError];
      }
      return [[], false, null];
    }, [detectedComponents, loadError, formState.source, isContainerImage]);

  const initialValues: ReviewComponentsFormValues = {
    components: transformComponentValues(loaded && !detectionError ? components : []),
  };

  const handleSubmit = React.useCallback(
    (data: ReviewComponentsFormValues, actions) => {
      createResources(formState, data.components)
        .then((appName) => {
          navigate(`/app-studio/applications?name=${appName}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          actions.setSubmitting(false);
          actions.setStatus({ submitError: error.message });
        });
    },
    [formState, navigate],
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      enableReinitialize
      validationSchema={reviewFormSchema}
    >
      {(props) => (
        <ReviewComponentsForm
          {...props}
          detectedComponents={components}
          detectedComponentsLoaded={loaded}
          detectedComponentsError={detectionError}
        />
      )}
    </Formik>
  );
};
