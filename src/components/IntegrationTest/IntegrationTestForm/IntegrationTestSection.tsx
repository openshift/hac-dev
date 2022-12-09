import * as React from 'react';
import { FormSection, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { FormValues } from '../../../hacbs/components/ImportForm/types';
import { CheckboxField, InputField } from '../../../shared';

type Props = { isInPage?: boolean; edit?: boolean };

const IntegrationTestSection: React.FC<Props> = ({ isInPage, edit }) => {
  const { setTouched } = useFormikContext<FormValues>();

  // TODO: Remove when it is fixed in formik-pf
  React.useEffect(() => {
    setTouched({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isInPage && (
        <>
          <TextContent data-test="integration-test-section-header">
            <Text component={TextVariants.h1}>Add integration test</Text>
            <Text component={TextVariants.p}>
              Test all your components after you commit code by adding an integration test.
              Integration tests run in parallel using temporary environments. Only validated
              versions of applications will be deployed.
            </Text>
          </TextContent>
        </>
      )}
      <FormSection>
        <InputField
          label="Integration test name"
          name="integrationTest.name"
          helpText={
            edit
              ? ''
              : 'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).'
          }
          data-test="display-name-input"
          isReadOnly={edit}
          required
        />
        <InputField
          required
          label="Image bundle"
          helpText="Enter the path to the container image. It should contain a tekton pipeline that executes your test."
          name="integrationTest.bundle"
          data-test="container-image-input"
        />
        <InputField
          label="Pipeline to run"
          name="integrationTest.pipeline"
          helpText="The name of the pipeline to run should match the one in the bundle."
          data-test="pipeline-name-input"
          required
        />
        <CheckboxField
          name="integrationTest.optional"
          aria-label="Mark as optional for release"
          label="Mark as optional for release"
          helpText="Passing this test is optional, and it cannot prevent the application from being deployed or released."
          data-test="optional-release-checkbox"
        />
      </FormSection>
    </>
  );
};

export default IntegrationTestSection;
