import * as yup from 'yup';

export const gitUrlRegex =
  /^((((ssh|git|https?:?):\/\/:?)(([^\s@]+@|[^@]:?)[-\w.]+(:\d\d+:?)?(\/[-\w.~/?[\]!$&'()*+,;=:@%]*:?)?:?))|([^\s@]+@[-\w.]+:[-\w.~/?[\]!$&'()*+,;=:@%]*?:?))$/;

// generic regex to validate container image /^[^/]+\.[^/.]+\/([a-z0-9-_]+\/)?[^/.]+(:.+)?$/
export const containerImageRegex = /^(https:\/\/)?quay.io\/([a-z0-9-_]+\/)?[^/.]+(:.+)?$/;

export const componentNameRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

const combineRegExps = (...regexps: RegExp[]) => {
  const regexStringsWithoutFlags = regexps.map((regex) => regex.source);
  return new RegExp(regexStringsWithoutFlags.join('|'));
};

export const applicationValidationSchema = yup.object({
  application: yup.object({
    name: yup.string().required('Required'),
  }),
});

export const sourceValidationSchema = yup.object({
  source: yup
    .string()
    .max(2000, 'Please enter a URL that is less than 2000 characters.')
    .matches(combineRegExps(gitUrlRegex, containerImageRegex), 'Invalid Source URL')
    .required('Required'),
  git: yup.object({
    ref: yup.string(),
    context: yup.string(),
  }),
});

export const reviewValidationSchema = yup.object({
  components: yup.array().of(
    yup.object({
      componentStub: yup.object({
        componentName: yup
          .string()
          .matches(componentNameRegex, 'Invalid component name')
          .required('Required'),
        targetPort: yup
          .number()
          .typeError('Must be an integer')
          .min(1, 'Port must be between 1 and 65535.')
          .max(65535, 'Port must be between 1 and 65535.')
          .optional(),
        resources: yup.object({
          cpu: yup.number().typeError('Must be an integer').min(0, 'Value must be greater than 0'),
          memory: yup
            .number()
            .typeError('Must be an integer')
            .min(0, 'Value must be greater than 0'),
        }),
        replicas: yup
          .number()
          .typeError('Must be an integer')
          .min(0, 'Value must be greater than 0'),
      }),
    }),
  ),
});
