import { FormikHelpers } from 'formik';
import { createComponents } from '../../../../components/ImportForm/utils/submit-utils';
import { ImportFormValues } from '../../../../components/ImportForm/utils/types';
import { createApplication } from '../../../../utils/create-utils';
import { FormValues } from '../types';

export const onComponentsSubmit = async (
  { inAppContext, application, components, applicationData, namespace, secret }: FormValues,
  formikBag: FormikHelpers<ImportFormValues>,
) => {
  const applicationName = inAppContext ? application : applicationData.metadata.name;
  try {
    await createComponents(components, applicationName, namespace, secret, false, true);
  } catch (error) {
    const message = error.code === 409 ? 'Component name already exists' : error.message;
    const errorComponent = error.json.details.name;
    const errorComponentIndex = components.findIndex(
      (c) => c.componentStub.componentName === errorComponent,
    );
    if (errorComponentIndex >= 0) {
      formikBag.setFieldError(
        `components[${errorComponentIndex}].componentStub.componentName`,
        message,
      );
    }
    throw error;
  }
};

export const onApplicationSubmit = async (
  { application, namespace }: FormValues,
  formikBag: FormikHelpers<ImportFormValues>,
) => {
  try {
    await createApplication(application, namespace, true);
    const applicationData = await createApplication(application, namespace, false);
    formikBag.setFieldValue('applicationData', applicationData);
    return applicationData;
  } catch (error) {
    const message = error.code === 409 ? 'Application name already exists.' : error.message;
    formikBag.setFieldError('application', message);
    throw error;
  }
};
