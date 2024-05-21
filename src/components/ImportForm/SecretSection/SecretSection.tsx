import React from 'react';
import { TextInputTypes, GridItem, Grid, FormSection } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { useFormikContext } from 'formik';
import { useSecrets } from '../../../hooks/useSecrets';
import { SecretModel } from '../../../models';
import { InputField, TextColumnField } from '../../../shared';
import { AccessReviewResources } from '../../../types/rbac';
import { useAccessReviewForModels } from '../../../utils/rbac';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../../ButtonWithAccessTooltip';
import { useModalLauncher } from '../../modal/ModalProvider';
import { SecretModalLauncher } from '../../Secrets/SecretModalLauncher';
import { getSupportedPartnerTaskSecrets } from '../../Secrets/utils/secret-utils';
import { ImportFormValues } from '../type';

const accessReviewResources: AccessReviewResources = [{ model: SecretModel, verb: 'create' }];

const SecretSection = () => {
  const [canCreateSecret] = useAccessReviewForModels(accessReviewResources);
  const showModal = useModalLauncher();
  const { values, setFieldValue } = useFormikContext<ImportFormValues>();
  const { namespace } = useWorkspaceInfo();

  const [secrets, secretsLoaded] = useSecrets(namespace);

  const partnerTaskNames = getSupportedPartnerTaskSecrets().map(({ label }) => label);
  const partnerTaskSecrets: string[] =
    secrets && secretsLoaded
      ? secrets
          ?.filter((rs) => partnerTaskNames.includes(rs.metadata.name))
          ?.map((s) => s.metadata.name) || []
      : [];

  const onSubmit = React.useCallback(
    (secretValue: any) => {
      const allSecrets = [...values.importSecrets, secretValue];
      const secretNames = [...values.newSecrets, secretValue.secretName];
      setFieldValue('importSecrets', allSecrets);
      setFieldValue('newSecrets', secretNames);
    },
    [values, setFieldValue],
  );

  return (
    <FormSection>
      <TextColumnField
        name="newSecrets"
        label="Build time secret"
        addLabel="Add secret"
        placeholder="Secret"
        helpText="Keep your data secure by defining a build time secret. Secrets are stored at a workspace level so applications within workspace will have access to these secrets."
        noFooter
        isReadOnly
        onChange={(v) =>
          setFieldValue(
            'importSecrets',
            values.importSecrets.filter((vs) => v.includes(vs.secretName)),
          )
        }
      >
        {(props) => {
          return (
            <Grid>
              <GridItem span={6}>
                <InputField name={props.name} type={TextInputTypes.text} isDisabled />
              </GridItem>
              <GridItem span={6}>{props.removeButton}</GridItem>
            </Grid>
          );
        }}
      </TextColumnField>
      <ButtonWithAccessTooltip
        isInline
        type="button"
        variant="link"
        data-testid="add-secret-button"
        icon={<PlusCircleIcon />}
        onClick={() =>
          showModal(SecretModalLauncher([...partnerTaskSecrets, ...values.newSecrets], onSubmit))
        }
        isDisabled={!canCreateSecret}
        tooltip="You don't have access to add a secret"
      >
        Add secret
      </ButtonWithAccessTooltip>
    </FormSection>
  );
};
export default SecretSection;
