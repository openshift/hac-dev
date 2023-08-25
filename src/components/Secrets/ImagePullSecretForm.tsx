import React from 'react';
import { FormSection, Text, TextVariants } from '@patternfly/react-core';
import { useField } from 'formik';
import { DropdownField } from '../../shared';
import EncodedFileUploadField from './utils/EncodedFileUploadField';
import { MultiImageCredentialForm } from './utils/MultiImageCredentialForm';

enum ImagePullSecretType {
  ImageRegistryCreds = 'Image registry credentials',
  UploadConfigFile = 'Upload configuration file',
}

export const ImagePullSecretForm: React.FC = () => {
  const [{ value: type }] = useField<ImagePullSecretType>('imageAuthType');

  return (
    <>
      <FormSection>
        <DropdownField
          name="imageAuthType"
          label="Authentication type"
          helpText="Select how you want to authenticate"
          items={[
            { key: 'imageRegistryCreds', value: ImagePullSecretType.ImageRegistryCreds },
            { key: 'uploadConfigFile', value: ImagePullSecretType.UploadConfigFile },
          ]}
          required
        />
      </FormSection>
      {type === ImagePullSecretType.ImageRegistryCreds ? (
        <FormSection title="Image registry credentials">
          <Text component={TextVariants.small}>
            You can create one or more image registry credentials
          </Text>
          <MultiImageCredentialForm name="imageRegistryCreds" />
        </FormSection>
      ) : (
        <FormSection>
          <EncodedFileUploadField
            name="dockerconfig"
            id="text-file-docker-config"
            label="Upload a .dockercfg or .docker/config.json file"
            helpText="This file contains configuration details and credentials to connect to a secure image registry."
            required
          />
        </FormSection>
      )}
    </>
  );
};
