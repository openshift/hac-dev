import * as React from 'react';
import { Helmet } from 'react-helmet';
import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Alert,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons';
import { Formik } from 'formik';
import { UserSignupStatus } from '../../hooks/useSignupStatus';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { SignupValues } from '../../types/signup';
import SignupBanner from './SignupBanner';
import SignupForm from './SignupForm';

export type SignupViewProps = {
  status: string;
  onStatusChange: React.Dispatch<React.SetStateAction<string>>;
};

const SignupView: React.FC<SignupViewProps> = ({
  status = UserSignupStatus.NOT_SIGNEDUP,
  onStatusChange,
}) => {
  const initialValues: SignupValues = {
    signUpText: '',
  };

  const handleSubmit = (values, actions) => {
    return commonFetch('/api/v1/signup', { method: 'POST' })
      .then((res: Response) => {
        if (res.status === 202) {
          onStatusChange(UserSignupStatus.PENDING_APPROVAL);
        }
      })
      .catch((e) => {
        actions.setSubmitting(false);
        // eslint-disable-next-line no-console
        console.error('error -----', e);
      });
  };

  return (
    <>
      <Helmet>
        <title>Signup Page</title>
      </Helmet>
      <SignupBanner />
      <PageSection isFilled>
        <Stack hasGutter>
          <StackItem>
            {status === UserSignupStatus.PENDING_APPROVAL ? (
              <Card isLarge>
                <CardTitle>Thank you for requesting App Studio early access</CardTitle>
                <CardBody>
                  <Alert
                    variant="info"
                    isInline
                    title="We have received your request. We are working hard to get you early access to the App Studio services."
                  >
                    <p>
                      After we approve your request, we will send you an email notification with
                      information about how you can access App Studio and start using the service to
                      bring in your code.
                    </p>
                  </Alert>
                </CardBody>
              </Card>
            ) : (
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {(props) => <SignupForm {...props} />}
              </Formik>
            )}
          </StackItem>
          <StackItem>
            <Card isLarge>
              <CardTitle>App Studio Overview</CardTitle>
              <CardBody style={{ paddingLeft: '16px' }}>
                <Card isPlain isCompact>
                  <CardTitle>Bring applications</CardTitle>
                  <CardBody>
                    Create applications with your source code or our bundled samples. Your
                    applications will be automatically containerized with Red Hat&apos;s secure
                    runtime images. You can skip source code and just define applications with your
                    own container images.
                  </CardBody>
                </Card>
                <Card isPlain isCompact>
                  <CardTitle>Iterate on an application</CardTitle>
                  <CardBody>
                    You can run your containerized applications in the bundled, shared
                    Kubernetes-based environment that is powered by Red Hat OpenShift. You can share
                    the routes created for your services so you can continuously update and run your
                    applications.
                  </CardBody>
                </Card>
                <Card isPlain isCompact>
                  <CardTitle>Add SDLC environments</CardTitle>
                  <CardBody>
                    Add SLDC environments for your applications, each defined to deploy the
                    application to a Red Hat OpenShift cluster on your desired cloud platforms. You
                    can easily define deployment, scaling, and application settings for each
                    environment.
                  </CardBody>
                </Card>
                <Card isPlain isCompact>
                  <CardTitle>Deploy and manage applications</CardTitle>
                  <CardBody>
                    Promote your applications across SDLC environments with our GitOps-based
                    deployment service. Promotions can be triggered automatically or manually,
                    without having to manage the GitOps solution. From a single window, you can
                    monitor the applications as they get run and scale across multi-cloud
                    environments.
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card isLarge>
              <CardTitle>Common use cases</CardTitle>
              <CardBody style={{ paddingLeft: '16px' }}>
                <Split hasGutter>
                  <SplitItem>
                    <Card isPlain isCompact>
                      <CardTitle>Full stack applications</CardTitle>
                      <CardBody>
                        App Studio simplifies the experience of building, scaling, and managing
                        containerized applications. No experience in containerization, Kubernetes,
                        or GitOps is needed.
                      </CardBody>
                    </Card>
                  </SplitItem>
                  <SplitItem>
                    <Card isPlain isCompact>
                      <CardTitle>Scaling across geos and cloud platforms</CardTitle>
                      <CardBody>
                        Build backend and frontend applications in popular languages such as Java,
                        JavaScript, Python with secure runtimes provided by Red Hat, or your
                        container images. With App Studio, you can build API services, static web
                        sites, web applications.
                      </CardBody>
                    </Card>
                  </SplitItem>
                  <SplitItem>
                    <Card isPlain isCompact>
                      <CardTitle>Software development lifecycle</CardTitle>
                      <CardBody>
                        App Studio provides the ability to run multiple instances of distributed
                        microservices across geos and cloud platforms. Each application component
                        can be set up for auto-scaling and fault tolerance.
                      </CardBody>
                    </Card>
                  </SplitItem>
                </Split>
              </CardBody>
              <CardFooter>
                <ExternalLink href="https://developers.redhat.com/">
                  Learn more about App Studio on Red Hat Developer&nbsp;
                  <ExternalLinkAltIcon />
                </ExternalLink>
              </CardFooter>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export default SignupView;
