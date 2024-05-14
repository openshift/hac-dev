import * as React from 'react';
import { Flex, FlexItem, FormSection } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { InputField } from 'formik-pf';
import { ApplicationThumbnail } from '../../ApplicationDetails/ApplicationThumbnail';
import { ImportFormValues } from '../type';

const ApplicationSection: React.FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const {
    values: { inAppContext },
  } = useFormikContext<ImportFormValues>();

  return (
    <Flex>
      <FlexItem>
        <ApplicationThumbnail annotationValue={0} />
      </FlexItem>
      <FlexItem flex={{ default: 'flex_1' }}>
        <FormSection>
          <InputField
            name="application"
            label="Application name"
            placeholder="Enter name"
            isDisabled={inAppContext}
            isRequired
            dataTest="app-name-field"
            className="hac-input-field"
          />
        </FormSection>
      </FlexItem>
    </Flex>
  );
};

export default ApplicationSection;
