import * as React from 'react';
import {
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash-es';
import { InputField, TextAreaField } from '../../../../../shared';
import StatusDropdown from './StatusDropdown';
import UploadDate from './UploadDate';

type BugFormValues = {
  issueKey: string;
  url: string;
  uploadDate: string;
  status: string;
};

type BugFormContentProps = {
  modalToggle: () => void;
};
const BugFormContent: React.FC<BugFormContentProps> = ({ modalToggle }) => {
  const { handleSubmit, isSubmitting, errors, dirty } = useFormikContext<BugFormValues>();

  return (
    <Form>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component={TextVariants.p}>
              Provide information about a Bug that has already been resolved.
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <InputField data-test="bug-issue-key" label="Bug issue key" name="key" required />
        </StackItem>
        <StackItem>
          <InputField data-test="bug-url" label="URL" name="url" required />
        </StackItem>
        <StackItem>
          <UploadDate name="uploadDate" label="Last updated" />
        </StackItem>
        <StackItem>
          <StatusDropdown name="status" />
        </StackItem>
        <StackItem>
          <TextAreaField name="summary" label="Summary" />
        </StackItem>
        <StackItem>
          <Button
            isDisabled={!dirty || !isEmpty(errors) || isSubmitting}
            type={ButtonType.submit}
            isLoading={isSubmitting}
            data-test="add-bug-btn"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
              modalToggle();
            }}
          >
            Add Bug
          </Button>
          <Button
            data-testid="close-bug-modal"
            variant={ButtonVariant.link}
            className="pf-v5-u-ml-sm"
            onClick={(e) => {
              e.preventDefault(), modalToggle();
            }}
          >
            Close
          </Button>
        </StackItem>
      </Stack>
    </Form>
  );
};

export default BugFormContent;
