import React from 'react';
import { HelperText, HelperTextItem, Title, TitleSizes } from '@patternfly/react-core';
import { useField } from 'formik';
import { DropdownField } from '../../../shared';
import { ImagePullSecretType } from '../../../types';
import EncodedFileUploadField from './EncodedFileUploadField';
import { MultiImageCredentialForm } from './MultiImageCredentialForm';

export const ImagePullSecretForm: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [{ value: type }] = useField<ImagePullSecretType>('image.authType');

  return (
    <>
      <DropdownField
        name="image.authType"
        label="Authentication type"
        helpText="Select how you want to authenticate"
        items={[
          { key: 'imageRegistryCreds', value: ImagePullSecretType.ImageRegistryCreds },
          { key: 'uploadConfigFile', value: ImagePullSecretType.UploadConfigFile },
        ]}
        required
        validateOnChange
      />
      {type === ImagePullSecretType.ImageRegistryCreds ? (
        <>
          <Title size={TitleSizes.md} headingLevel="h4">
            Image registry credentials
            <HelperText style={{ fontWeight: 100 }}>
              <HelperTextItem variant="indeterminate">
                You can create one or more image registry credentials
              </HelperTextItem>
            </HelperText>
          </Title>
          <MultiImageCredentialForm name="image.registryCreds" />
        </>
      ) : (
        <EncodedFileUploadField
          name="image.dockerconfig"
          id="text-file-docker-config"
          label="Upload a .dockercfg or .docker/config.json file"
          helpText="This file contains configuration details and credentials to connect to a secure image registry"
          required
        />
      )}
    </>
  );
};
