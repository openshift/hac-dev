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
import { InputField } from '../../../../../shared';
import ComponentField from './ComponentField';

type CVEFormValues = {
  CVEKey: string;
  components?: string[];
  uploadDate?: string;
  status?: string;
  summary?: string;
};

type CVEFormContentProps = {
  modalToggle: () => void;
};
const CVEFormContent: React.FC<CVEFormContentProps> = ({ modalToggle }) => {
  const { handleSubmit, isSubmitting, errors, dirty } = useFormikContext<CVEFormValues>();

  return (
    <Form>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component={TextVariants.p}>
              Provide information about a CVE that has already been resolved.
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <InputField data-test="cve-issue-id" label="CVE ID" name="id" required />
        </StackItem>
        <StackItem>
          <ComponentField name="components" />
        </StackItem>
        <StackItem>
          <Button
            isDisabled={!dirty || !isEmpty(errors) || isSubmitting}
            type={ButtonType.submit}
            isLoading={isSubmitting}
            data-test="add-cve-btn"
            onClick={(e) => {
              e.preventDefault(), handleSubmit();
              modalToggle();
            }}
          >
            Add CVE
          </Button>
          <Button
            data-test="close-cve-modal"
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

export default CVEFormContent;
