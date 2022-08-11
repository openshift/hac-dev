import * as yup from 'yup';
import { containerImageRegex } from '../../../../components/ImportForm/utils/validation-utils';

export const integrationTestValidationSchema = yup.object({
  integrationTest: yup.object({
    name: yup.string().required('Required'),
    pipeline: yup.string().required('Required'),
    bundle: yup
      .string()
      .required('Required')
      .max(2000, 'Please enter a URL that is less than 2000 characters.')
      .matches(containerImageRegex, 'Invalid container image'),
  }),
});
