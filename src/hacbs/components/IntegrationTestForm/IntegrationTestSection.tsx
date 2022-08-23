import * as React from 'react';
import {
  Alert,
  AlertActionCloseButton,
  FormSection,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons';
import { useFormikContext } from 'formik';
import { CheckboxField, HelpTooltipIcon, InputField } from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { FormValues } from '../ImportForm/types';

const IntegrationTestSection: React.FunctionComponent<{ isInPage?: boolean }> = ({ isInPage }) => {
  const [infoAlert, setInfoAlert] = React.useState<boolean>(true);
  const { setTouched } = useFormikContext<FormValues>();

  // TODO: Remove when it is fixed in formik-pf
  React.useEffect(() => {
    setTouched({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isInPage ? (
        <>
          <TextContent data-test="integration-test-section-header">
            <Text component={TextVariants.h1}>Add integration test pipeline</Text>
            <Text component={TextVariants.p}>
              Add an integration test pipeline to test all your components.
              <br />
              By default, previous GitHub credentials will be used to validate your URL. If it
              fails, you fails, you must revalidate with a different repo.
            </Text>
            <ExternalLink href="#">
              Learn more about setting up an integration test pipeline <ExternalLinkAltIcon />
            </ExternalLink>
          </TextContent>
        </>
      ) : null}
      <FormSection>
        <InputField
          aria-label="Display name"
          label="Display name"
          name="integrationTest.name"
          placeholder="Enter the integration test pipeline name"
          required
        />
        <InputField
          required
          aria-label="Container image"
          label="Container image"
          labelIcon={<HelpTooltipIcon content={'Provide your image bundle'} />}
          name="integrationTest.bundle"
        />
        <InputField
          aria-label="Pipeline specified in container image"
          label="Pipeline specified in container image"
          name="integrationTest.pipeline"
          helpText="Specify the pipeline name as it appears in the image bundle."
          required
        />
        <CheckboxField
          name="integrationTest.optional"
          aria-label="Mark as optional for release"
          label="Mark as optional for release"
          helpText="Passing this test is optional, and it cannot prevent the application from being deployed or released."
        />
        {infoAlert && (
          <Alert
            variant="info"
            isInline
            title="This pipeline will appear twice on your application workflow"
            actionClose={
              <AlertActionCloseButton
                data-test="hacbs-close-info"
                onClose={() => setInfoAlert(false)}
              />
            }
          >
            After adding your pipeline, it will run on your component and then again on the entire
            app. You can see this on your application workflow.
            <br />
            {/* <a href="#">Learn more</a> */}
          </Alert>
        )}
      </FormSection>
    </>
  );
};

export default IntegrationTestSection;
