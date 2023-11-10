import React from 'react';
import { Title, FormHelperText } from '@patternfly/react-core';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

type FormHeaderProps = {
  title: React.ReactNode;
  helpText?: React.ReactNode;
  marginTop?: SpacerSize;
  marginBottom?: SpacerSize;
};

const FormHeader: React.FC<React.PropsWithChildren<FormHeaderProps>> = ({
  title,
  helpText,
  marginTop,
  marginBottom,
}) => {
  const marginStyles = {
    ...(marginTop ? { marginTop: `var(--pf-v5-global--spacer--${marginTop})` } : {}),
    ...(marginBottom ? { marginBottom: `var(--pf-v5-global--spacer--${marginBottom})` } : {}),
  };

  return (
    <div data-test="form-header-container" style={marginStyles}>
      <Title headingLevel="h1" size="2xl">
        {title}
      </Title>
      <FormHelperText style={{ marginTop: 'var(--pf-v5-global--spacer--xs)' }}>
        {helpText}
      </FormHelperText>
    </div>
  );
};

export default FormHeader;
