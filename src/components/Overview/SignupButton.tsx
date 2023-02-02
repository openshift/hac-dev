import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';
import { Form, Button, ButtonVariant, ButtonType } from '@patternfly/react-core';
import { Formik } from 'formik';
import { SIGNUP_PENDING_FLAG } from '../../utils/flag-utils';

const SignupButton: React.FC = () => {
  const [, setSignupPending] = useFeatureFlag(SIGNUP_PENDING_FLAG);

  const onSubmit = (values, actions) => {
    return commonFetch('/registration/api/v1/signup', { method: 'POST' })
      .then((res: Response) => {
        if (res.status === 202) {
          setSignupPending(true);
        }
      })
      .catch((e) => {
        actions.setSubmitting(false);
        // eslint-disable-next-line no-console
        console.error('error -----', e);
      });
  };

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Button
            aria-label="Join the waitlist"
            variant={ButtonVariant.primary}
            type={ButtonType.submit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            style={{ width: 'fit-content' }}
            isLarge
          >
            Join the waitlist
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignupButton;
