import mapValues from 'lodash/mapValues';
import { object, lazy, number, string } from 'yup';

const componentNameRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

export const reviewFormSchema = object({
  deployMethod: number(),
  components: lazy((obj) =>
    object(
      mapValues(obj, () =>
        object({
          name: string().matches(componentNameRegex, 'Invalid component name').required('Required'),
          targetPort: number()
            .typeError('Must be an integer')
            .min(1, 'Port must be between 1 and 65535.')
            .max(65535, 'Port must be between 1 and 65535.')
            .optional(),
        }),
      ),
    ),
  ),
});
