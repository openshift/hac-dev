import { FormikHelpers } from 'formik';
import { createComponents } from '../../../../components/ImportForm/utils/submit-utils';
import { ImportFormValues } from '../../../../components/ImportForm/utils/types';
import { createApplication } from '../../../../utils/create-utils';
import { FormValues } from '../types';

export const onComponentsSubmit = async (
  { components, applicationData, namespace, secret }: FormValues,
  formikBag: FormikHelpers<ImportFormValues>,
) => {
  try {
    await createComponents(components, applicationData.metadata.name, namespace, secret, true);
    await createComponents(components, applicationData.metadata.name, namespace, secret, false);
  } catch (error) {
    const message = error.code === 409 ? 'Component name already exists.' : error.message;
    formikBag.setStatus({ submitError: message });
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
  } catch (error) {
    const message = error.code === 409 ? 'Application name already exists.' : error.message;
    formikBag.setFieldError('application', message);
    throw error;
  }
};
