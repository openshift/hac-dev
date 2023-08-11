import * as yup from 'yup';
import { convertBaseValueToUnits, convertUnitValueToBaseValue } from './conversion-utils';
import { ImportFormValues } from './types';

export const gitUrlRegex =
  /^((((ssh|git|https?:?):\/\/:?)(([^\s@]+@|[^@]:?)[-\w.]+(:\d\d+:?)?(\/[-\w.~/?[\]!$&'()*+,;=:@%]*:?)?:?))|([^\s@]+@[-\w.]+:[-\w.~/?[\]!$&'()*+,;=:@%]*?:?))$/;

// generic regex to validate container image /^[^/]+\.[^/.]+\/([a-z0-9-_]+\/)?[^/.]+(:.+)?$/
export const containerImageRegex = /^(https:\/\/)?quay.io\/([a-z0-9-_]+\/)?[^/.]+(:.+)?$/;

export const MAX_RESOURCE_NAME_LENGTH = 63;
export const RESOURCE_NAME_LENGTH_ERROR_MSG = `Must be no more than ${MAX_RESOURCE_NAME_LENGTH} characters.`;

export const resourceNameRegex = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;
export const RESOURCE_NAME_REGEX_MSG =
  'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).';

export const filePathOrURLRegex =
  /^((^\.|^\.\.|^\.?[\w-]+)(\/\.?(?=[\w-])[\w-]+)*(\.[\w-]+)*$)|(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

export const dnsSubDomainRegex = /[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?/;

const combineRegExps = (...regexps: RegExp[]) => {
  const regexStringsWithoutFlags = regexps.map((regex) => regex.source);
  return new RegExp(regexStringsWithoutFlags.join('|'));
};

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
            "That repository URL isn't quite right. Try again.",
          )
          .required('Required'),
        revision: yup.string(),
        context: yup.string(),
      }),
      isValidated: yup.boolean().isTrue().required('Required'),
    }),
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

const resourceLimitValidationSchema = (
  defaultBaseValue: number,
  selectedBaseValue: number,
  selectedUnit: string,
  extraSpace?: boolean,
) => {
  const selectedUnitMaxValue = convertBaseValueToUnits(defaultBaseValue, selectedUnit).value;

  return yup
    .number()
    .typeError('Must be an integer')
    .min(1, 'Value must be greater than 0')
    .test({
      test() {
        if (selectedBaseValue > defaultBaseValue) {
          return false;
        }
        return true;
      },
      message: `Value must not be greater than ${selectedUnitMaxValue}${
        extraSpace ? ' ' : ''
      }${selectedUnit}`,
    });
};

const cpuValidationSchema = (formValues: ImportFormValues) => {
  const defaultMaxCpu = formValues.resourceLimits?.max?.cpu;
  const defaultCpuUnit = formValues.resourceLimits?.max?.cpuUnit;

  const currentCpu = formValues.components?.[0]?.componentStub?.resources?.cpu;
  const currentCpuUnit = formValues.components?.[0]?.componentStub?.resources?.cpuUnit;

  const defaultMaxBaseValue = convertUnitValueToBaseValue(defaultMaxCpu, defaultCpuUnit);
  const currentBaseValue = convertUnitValueToBaseValue(`${currentCpu}`, currentCpuUnit);

  return resourceLimitValidationSchema(
    defaultMaxBaseValue.value,
    currentBaseValue.value,
    currentCpuUnit,
    true,
  );
};

const memoryValidationSchema = (formValues: ImportFormValues) => {
  const defaultMaxMemory = formValues.resourceLimits?.max?.memory;
  const defaultMemoryUnit = formValues.resourceLimits?.max?.memoryUnit;

  const currentMemory = formValues.components?.[0]?.componentStub?.resources?.memory;
  const currentMemoryUnit = formValues.components?.[0]?.componentStub?.resources?.memoryUnit;

  const defaultMaxBaseValue = convertUnitValueToBaseValue(defaultMaxMemory, defaultMemoryUnit);
  const currentBaseValue = convertUnitValueToBaseValue(`${currentMemory}`, currentMemoryUnit);

  return resourceLimitValidationSchema(
    defaultMaxBaseValue.value,
    currentBaseValue.value,
    currentMemoryUnit,
  );
};

export const reviewSectionValidationSchema = (formValues: ImportFormValues) =>
  yup.object({
    application: yup
      .string()
      .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
      .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG)
      .required('Required'),
    components: yup.array().of(
      yup.object({
        componentStub: yup.object({
          componentName: yup
            .string()
            .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
            .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG)
            .required('Required'),
          targetPort: yup
            .number()
            .typeError('Must be an integer')
            .min(1, 'Port must be between 1 and 65535.')
            .max(65535, 'Port must be between 1 and 65535.')
            .optional(),
          resources: yup.object({
            cpuUnit: yup.string(),
            cpu: cpuValidationSchema(formValues),
            memoryUnit: yup.string(),
            memory: memoryValidationSchema(formValues),
          }),
          replicas: yup
            .number()
            .typeError('Must be an integer')
            .min(0, 'Value must be greater than 0'),
          source: yup.object({
            git: yup.object({
              dockerfileUrl: yup
                .string()
                .matches(filePathOrURLRegex, 'Must be a valid relative file path or URL.'),
            }),
          }),
        }),
      }),
    ),
    selectedComponents: yup
      .array()
      .test('selected-components-test', ' ', (value) =>
        value ? value.filter(Boolean).length > 0 : true,
      ),
    runtime: yup.string().when('detectionFailed', {
      is: true,
      then: yup.string().required('Runtime not detected'),
    }),
    isDetected: yup.boolean().isTrue().required('Required'),
  });

export const SecretFromSchema = yup.object({
  secretName: yup
    .string()
    .required('Required')
    .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
    .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG)
    .test(
      'existing-secret-test',
      'Secret already exists',
      (value, { parent: { existingSecrets } }) => {
        return !existingSecrets.includes(value);
      },
    ),
  keyValues: yup.array().of(
    yup.object({
      key: yup.string().required('Required'),
      value: yup.string().required('Required'),
    }),
  ),
});

export const reviewValidationSchema = yup.mixed().test((values: ImportFormValues) => {
  return reviewSectionValidationSchema(values).validate(values, { abortEarly: false }) as any;
});
