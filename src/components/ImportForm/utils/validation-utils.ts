import * as yup from 'yup';

export const gitUrlRegex =
  /^((((ssh|git|https?:?):\/\/:?)(([^\s@]+@|[^@]:?)[-\w.]+(:\d\d+:?)?(\/[-\w.~/?[\]!$&'()*+,;=:@%]*:?)?:?))|([^\s@]+@[-\w.]+:[-\w.~/?[\]!$&'()*+,;=:@%]*?:?))$/;

// generic regex to validate container image /^[^/]+\.[^/.]+\/([a-z0-9-_]+\/)?[^/.]+(:.+)?$/
export const containerImageRegex = /^(https:\/\/)?quay.io\/([a-z0-9-_]+\/)?[^/.]+(:.+)?$/;

export const resourceNameRegex = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

const combineRegExps = (...regexps: RegExp[]) => {
  const regexStringsWithoutFlags = regexps.map((regex) => regex.source);
  return new RegExp(regexStringsWithoutFlags.join('|'));
};

export const applicationValidationSchema = yup.object({
  application: yup
    .string()
    .matches(resourceNameRegex, 'Name cannot contain spaces, uppercase or special characters.')
    .required('Required'),
});

const createSourceValidationSchema = (containerImageSupport: boolean) =>
  yup.object({
    source: yup.object({
      git: yup.object({
        url: yup
          .string()
          .trim()
          .max(2000, 'Please enter a URL that is less than 2000 characters.')
          .matches(
            containerImageSupport ? combineRegExps(gitUrlRegex, containerImageRegex) : gitUrlRegex,
            'Invalid Source URL',
          )
          .required('Required'),
        revision: yup.string(),
        context: yup.string(),
      }),
    }),
    isValidated: yup.boolean().isTrue().required('Required'),
  });

export const sourceValidationSchema = createSourceValidationSchema(true);
export const gitSourceValidationSchema = createSourceValidationSchema(false);

export const sampleValidationSchema = yup.object({
  source: yup.object({
    git: yup.object({
      url: yup.string().required(),
    }),
  }),
});

export const reviewValidationSchema = yup.object({
  components: yup.array().of(
    yup.object({
      componentStub: yup.object({
        componentName: yup
          .string()
          .matches(resourceNameRegex, 'Invalid component name')
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
  runtime: yup.string().when('detectionFailed', {
    is: true,
    then: yup.string().required('Runtime not detected'),
  }),
  isDetected: yup.boolean().isTrue().required('Required'),
});
