import * as React from 'react';
import {
  Button,
  Divider,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Form,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Icon,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { FieldArray, useFormikContext } from 'formik';
import { isEmpty } from 'lodash-es';
import { FormFooter } from '../../shared';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { RawComponentProps } from '../modal/createModalLauncher';
import { ComponentRelation } from './ComponentRelationForm';
import { ComponentRelationFormikValue, ComponentRelationNudgeType } from './type';
import { DUPLICATE_RELATONSHIP } from './utils';

type DefineComponentRelationModalProps = Omit<Pick<RawComponentProps, 'modalProps'>, 'onClose'> & {
  componentNames: string[];
  groupedComponents: { [application: string]: string[] };
  onCancel: () => void;
};

export const DefineComponentRelationModal: React.FC<DefineComponentRelationModalProps> = ({
  onCancel,
  modalProps,
  componentNames,
  groupedComponents,
}) => {
  const { values, handleSubmit, isSubmitting, dirty, errors, status } =
    useFormikContext<ComponentRelationFormikValue>();
  const isDuplicateRelationExist = errors?.relations?.includes(DUPLICATE_RELATONSHIP);

  return (
    <Modal
      {...modalProps}
      onClose={onCancel}
      title="Component relationships"
      description={
        <>
          Nudging references another component by digest.{' '}
          <ExternalLink href="https://konflux-ci.dev/docs/how-tos/configuring/component-nudges/">
            Learn more about nudging.
          </ExternalLink>
        </>
      }
      variant={ModalVariant.medium}
      footer={
        <FormFooter
          submitLabel={'Save relationships'}
          handleCancel={onCancel}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
          errorMessage={status?.submitError}
        />
      }
    >
      <Form onSubmit={handleSubmit}>
        <FieldArray
          name="relations"
          render={(arrayHelpers) => {
            return (
              <Flex direction={{ default: 'column' }}>
                {values.relations.map((val, index) => {
                  return (
                    <>
                      <ComponentRelation
                        key={index}
                        componentNames={componentNames}
                        groupedComponents={groupedComponents}
                        index={index}
                        removeProps={{
                          disableRemove: values.relations.length <= 1,
                          onRemove: () => arrayHelpers.remove(index),
                        }}
                      />
                      {index !== values.relations.length - 1 ? <Divider /> : null}
                    </>
                  );
                })}
                <FlexItem>
                  {isDuplicateRelationExist && (
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem variant="error">
                          This relationship is already set up. To edit, go to the respective field
                          in this modal
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  )}
                </FlexItem>
                <FlexItem>
                  <Button
                    className="pf-m-link--align-left"
                    onClick={() =>
                      arrayHelpers.push({
                        source: '',
                        nudgeType: ComponentRelationNudgeType.NUDGES,
                        target: [],
                      })
                    }
                    type="button"
                    data-test="add-key-value-button"
                    variant="link"
                    icon={<PlusCircleIcon />}
                  >
                    Add another component relationship
                  </Button>
                </FlexItem>
              </Flex>
            );
          }}
        />
      </Form>
    </Modal>
  );
};

const SuccessIcon: React.FC = () => (
  <Icon status="success">
    <CheckCircleIcon />
  </Icon>
);

type ConfirmSubmissionComponentRelationModalProps = Pick<RawComponentProps, 'modalProps'>;

export const ConfirmSubmissionComponentRelationModal: React.FC<
  ConfirmSubmissionComponentRelationModalProps
> = ({ modalProps: { onClose, ...rest } }) => {
  return (
    <Modal {...rest} variant={ModalVariant.medium} showClose={false}>
      <EmptyState>
        <EmptyStateHeader
          titleText="Relationships updated!"
          headingLevel="h2"
          icon={<EmptyStateIcon icon={SuccessIcon} />}
        />
        <EmptyStateBody>Checkout each component&apos;s details page to view</EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    </Modal>
  );
};

type ConfirmCancelationComponentRelationModalProps = Pick<RawComponentProps, 'modalProps'> & {
  onGoBack: () => void;
};

export const ConfirmCancelationComponentRelationModal: React.FC<
  ConfirmCancelationComponentRelationModalProps
> = ({ modalProps: { onClose, ...rest }, onGoBack }) => {
  return (
    <Modal
      {...rest}
      showClose={false}
      title="Your changes will be lost!"
      variant={ModalVariant.small}
      actions={[
        <Button key="confirm" variant="primary" onClick={onGoBack}>
          Go back
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Close anyway
        </Button>,
      ]}
    >
      Are you sure you want to close the window?
    </Modal>
  );
};
