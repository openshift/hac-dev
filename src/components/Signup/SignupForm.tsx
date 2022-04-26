import * as React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Form,
  Button,
  ButtonVariant,
  ButtonType,
} from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { TextAreaField } from '../../shared';
import { SignupValues } from '../../types/signup';

type SignupFormProps = FormikProps<SignupValues>;

const SignupForm: React.FC<SignupFormProps> = ({ handleSubmit, isSubmitting }) => {
  return (
    <Card isLarge>
      <CardTitle>Sign up for free for App Studio access</CardTitle>
      <CardBody>
        We have a high demand for access, and will approve your request as soon as possible. Click
        below to sign up for FREE early access to App Studio.
      </CardBody>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <TextAreaField
            name="signUpText"
            label="To sign up, tell us more about why you are interested in App Studio"
          />
          <Button
            aria-label="Sign up for App Studio access"
            variant={ButtonVariant.primary}
            type={ButtonType.submit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            style={{ width: 'fit-content' }}
            isLarge
          >
            {!isSubmitting ? 'Request Access for free' : 'Requesting Access to App Studio'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SignupForm;
