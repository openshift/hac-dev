import * as yup from 'yup';
import {
  RESOURCE_NAME_REGEX_MSG,
  resourceNameRegex,
} from '../../../ImportForm/utils/validation-utils';

export const integrationTestValidationSchema = yup.object({
  integrationTest: yup.object({
    name: yup.string().matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG).required('Required'),
    url: yup
      .string()
      .required('Required')
      .max(2000, 'Please enter a URL that is less than 2000 characters.'),
    path: yup
      .string()
      .required('Required')
      .max(2000, 'Please enter a path that is less than 2000 characters.'),
  }),
});
