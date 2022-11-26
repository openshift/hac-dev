import * as React from 'react';
import { FormSection, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { CheckboxField, HelpTooltipIcon, InputField } from '../../../shared';
import { FormValues } from '../ImportForm/types';

const IntegrationTestSection: React.FunctionComponent<{ isInPage?: boolean }> = ({ isInPage }) => {
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
              Add an integration test to test all your components.
              <br />
              By default, previous GitHub credentials will be used to validate your URL. If it
              fails, you fails, you must revalidate with a different repo.
            </Text>
          </TextContent>
        </>
      )}
      <FormSection>
        <InputField
          aria-label="Display name"
          label="Display name"
          name="integrationTest.name"
          placeholder="Enter the integration test name"
          data-test="display-name-input"
          required
        />
        <InputField
          required
          aria-label="Container image"
          label="Container image"
          labelIcon={<HelpTooltipIcon content={'Provide your image bundle'} />}
          name="integrationTest.bundle"
          data-test="container-image-input"
        />
        <InputField
          aria-label="Pipeline specified in container image"
          label="Pipeline specified in container image"
          name="integrationTest.pipeline"
          helpText="Specify the pipeline name as it appears in the image bundle."
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
