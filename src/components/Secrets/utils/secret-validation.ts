import { Base64 } from 'js-base64';
import attempt from 'lodash-es/attempt';
import isError from 'lodash-es/isError';
import * as yup from 'yup';
import { ImagePullSecretType, SecretTypeDropdownLabel, SourceSecretType } from '../../../types';
import {
  MAX_RESOURCE_NAME_LENGTH,
  RESOURCE_NAME_LENGTH_ERROR_MSG,
  RESOURCE_NAME_REGEX_MSG,
  resourceNameRegex,
} from '../../ImportForm/utils/validation-utils';

export const secretFormValidationSchema = yup.object({
  name: yup
    .string()
    .required('Required')
    .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
    .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG),
  type: yup.string(),
  opaque: yup.object().when('type', {
    is: SecretTypeDropdownLabel.opaque,
    then: yup.object({
      keyValues: yup.array().of(
        yup.object({
          key: yup.string().required('Required'),
          value: yup.string().required('Required'),
        }),
      ),
    }),
  }),
  image: yup.object().when('type', {
    is: SecretTypeDropdownLabel.image,
    then: yup.object({
      authType: yup.string(),
      registryCreds: yup.array().when('authType', {
        is: ImagePullSecretType.ImageRegistryCreds,
        then: yup.array().of(
          yup.object({
            registry: yup.string().required('Required'),
            username: yup.string().required('Required'),
            password: yup.string().required('Required'),
          }),
        ),
      }),
      dockerconfig: yup.string().when('authType', {
        is: ImagePullSecretType.UploadConfigFile,
        then: yup
          .string()
          .required('Required')
          .test('json-validation-test', 'Configuration file should be in JSON format.', (value) => {
            const parsedData = attempt(JSON.parse, value ? Base64.decode(value) : '');
            const hasError = isError(parsedData);
            return !hasError;
          }),
      }),
    }),
  }),
  source: yup.object().when('type', {
    is: SecretTypeDropdownLabel.source,
    then: yup.object({
      authType: yup.string(),
      username: yup.string().when('authType', {
        is: SourceSecretType.basic,
        then: yup.string().required('Required'),
      }),
      password: yup.string().when('authType', {
        is: SourceSecretType.basic,
        then: yup.string().required('Required'),
      }),
      ['ssh-privatekey']: yup.string().when('authType', {
        is: SourceSecretType.ssh,
        then: yup.string().required('Required'),
      }),
    }),
  }),
});
