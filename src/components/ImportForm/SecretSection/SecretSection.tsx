import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { FormGroup, TextInputTypes, Flex, FlexItem, Button } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { useFormikContext } from 'formik';
import { SPIAccessTokenBindingGroupVersionKind } from '../../../models';
import { InputField, TextColumnField } from '../../../shared';
import { SPIAccessTokenBindingKind } from '../../../types';
import { useModalLauncher } from '../../modal/ModalProvider';
import { SNYK_SPI_TOKEN_ACCESS_BINDING } from '../../Secrets/secret-utils';
import { SecretModal } from '../../Secrets/SecretModal';
import { ImportFormValues } from '../utils/types';

const SecretSection = () => {
  const showModal = useModalLauncher();
  const { values, setFieldValue } = useFormikContext<ImportFormValues>();

  const [secret] = useK8sWatchResource<SPIAccessTokenBindingKind>({
    groupVersionKind: SPIAccessTokenBindingGroupVersionKind,
    namespace: values.namespace,
    name: SNYK_SPI_TOKEN_ACCESS_BINDING,
  });
  const partnerTaskSecrets = secret?.status?.syncedObjectRef?.name
    ? [secret.status.syncedObjectRef.name]
    : [];

  const onSubmit = React.useCallback(
    (secretValue) => {
      const secrets = [...values.secrets, secretValue];
      const secretNames = [...values.newSecrets, secretValue.secretName];
      setFieldValue('secrets', secrets);
      setFieldValue('newSecrets', secretNames);
    },
    [values, setFieldValue],
  );

  return (
    <FormGroup>
      <TextColumnField
        name="newSecrets"
        label="Secrets"
        addLabel="Add secret"
        placeholder="Secret"
        helpText="Keep your data secure by defining a build time secret"
        noFooter
        onChange={(v) =>
          setFieldValue(
            'secrets',
            values.secrets.filter((vs) => v.includes(vs.secretName)),
          )
        }
      >
        {(props) => <InputField name={props.name} type={TextInputTypes.text} isReadOnly />}
      </TextColumnField>
      <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentFlexStart' }}>
        <FlexItem>
          <Button
            className="pf-m-link--align-left"
            type="button"
            variant="link"
            data-testid="add-secret-button"
            icon={<PlusCircleIcon />}
            onClick={() =>
              showModal(SecretModal([...partnerTaskSecrets, ...values.newSecrets], onSubmit))
            }
          >
            Add Secret
          </Button>
        </FlexItem>
      </Flex>
    </FormGroup>
  );
};
export default SecretSection;
