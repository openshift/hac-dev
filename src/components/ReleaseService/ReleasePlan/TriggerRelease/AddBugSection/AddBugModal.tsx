import * as React from 'react';
import {
  Button,
  ButtonType,
  DatePicker,
  Form,
  InputGroup,
  InputGroupItem,
  ModalVariant,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { Formik, useFormikContext, useField } from 'formik';
import { InputField, TextAreaField, DropdownField } from '../../../../../shared';
import { ComponentProps, createModalLauncher } from '../../../../modal/createModalLauncher';

type AddBugModalProps = ComponentProps & {
  obj?: any;
  bugArrayHelper: (values) => void;
};

type AddBugFormValues = {
  issueKey: string;
  url: string;
  uploadDate: string;
  status: string;
};

const dropdownItems = [
  { key: 'inProgress', value: 'In progress' },
  { key: 'closed', value: 'Closed' },
  { key: 'resolved', value: 'Resolved' },
];

type StatusDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
>;

export const StatusDropdown: React.FC<React.PropsWithChildren<StatusDropdownProps>> = (props) => {
  const [, , { setValue }] = useField<string>(props.name);

  return (
    <DropdownField
      {...props}
      label="Release plan"
      placeholder="Select status of bug"
      items={dropdownItems}
      onChange={(app: string) => setValue(app)}
    />
  );
};

const BugFormModal = () => {
  const { handleSubmit, isSubmitting } = useFormikContext<AddBugFormValues>();
  const formRef = React.useRef<HTMLDivElement>();

  return (
    <Form>
      <div ref={formRef}>
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.p}>
                Provide information about a Bug that has already been resolved.
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <InputField label="Bug issue key" name="issueKey" required />
          </StackItem>
          <StackItem>
            <InputField label="URL" name="url" required />
          </StackItem>
          <StackItem>
            <InputGroup>
              <InputGroupItem>
                <DatePicker appendTo={formRef.current} />
              </InputGroupItem>
            </InputGroup>
          </StackItem>
          <StackItem>
            <StatusDropdown name="status" />
          </StackItem>
          <StackItem>
            <TextAreaField name="summary" label="Summary" />
          </StackItem>
          <StackItem>
            <Button
              type={ButtonType.submit}
              isLoading={isSubmitting}
              data-testid="update-resource"
              onClick={(e) => {
                e.preventDefault(), handleSubmit();
              }}
            >
              Add Bug
            </Button>
          </StackItem>
        </Stack>
      </div>
    </Form>
  );
};

export const AddBugModal: React.FC<React.PropsWithChildren<AddBugModalProps>> = ({
  onClose,
  bugArrayHelper,
}) => {
  const setValues = React.useCallback(
    (fields) => {
      bugArrayHelper(fields);
      onClose();
    },
    [onClose, bugArrayHelper],
  );

  return (
    <Formik
      onSubmit={setValues}
      initialValues={{ issueKey: '', url: '', summary: '', uploadDate: '' }}
    >
      <BugFormModal />
    </Formik>
  );
};

export const createAddBugModal = createModalLauncher(AddBugModal, {
  'data-testid': `trigger-release-modal`,
  variant: ModalVariant.medium,
  title: `Add bug modal`,
});
