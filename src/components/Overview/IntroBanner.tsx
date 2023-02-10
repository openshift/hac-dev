import * as React from 'react';
import { Link } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource, useWorkspace } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Card,
  CardTitle,
  CardBody,
  Alert,
  Grid,
  GridItem,
  Button,
  Title,
  Text,
} from '@patternfly/react-core';
import { ApplicationGroupVersionKind } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ApplicationKind } from '../../types';
import { SIGNUP_FLAG, SIGNUP_PENDING_FLAG } from '../../utils/flag-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import SignupButton from './SignupButton';

import './IntroBanner.scss';

const IntroBanner: React.FC = () => {
  const namespace = useNamespace();
  const workspace = useWorkspace();
  const [signupFlag] = useFeatureFlag(SIGNUP_FLAG);
  const [signupPendingFlag] = useFeatureFlag(SIGNUP_PENDING_FLAG);

  const [applications, applicationsLoaded] = useK8sWatchResource<ApplicationKind[]>(
    signupFlag && namespace
      ? {
          groupVersionKind: ApplicationGroupVersionKind,
          namespace,
          isList: true,
          limit: 1,
        }
      : null,
  );

  return (
    <Grid>
      <GridItem span={8}>
        <Card className="intro-banner__content" isLarge>
          <CardTitle>
            <Title headingLevel="h1" size="2xl">
              Get started with CI/CD
            </Title>
          </CardTitle>
          <CardBody>
            <Text>
              Import, containerize and deploy to a development environment. With just a few clicks,
              you can interact with your application running in OpenShift and Kubernetes. Build
              here, go anywhere.
            </Text>
          </CardBody>
          <CardBody>
            {!signupFlag ? (
              signupPendingFlag ? (
                <Alert
                  variant="info"
                  isInline
                  title="We have received your request. While you are waiting, please join our Slack channel."
                >
                  <p>
                    We are working hard to get you early access. After we approve your request, we
                    will send you an email notification with information about how you can access
                    and start using the service.
                  </p>
                  <p>
                    Join the{' '}
                    <ExternalLink href="https://dn.dev/slack">
                      #software-supply-chain-security
                    </ExternalLink>{' '}
                    channel on Slack
                  </p>
                </Alert>
              ) : (
                <SignupButton />
              )
            ) : (
              <>
                <Button
                  className="intro-banner__cta"
                  component={(props) => (
                    <Link
                      {...props}
                      to={`/stonesoup/workspaces/${workspace}/applications/import`}
                    />
                  )}
                  variant="primary"
                  data-test="create-application"
                  isLarge
                >
                  + Create an application
                </Button>
                {applicationsLoaded && applications?.length > 0 ? (
                  <Button
                    className="intro-banner__cta"
                    component={(props) => <Link {...props} to="/stonesoup/workspaces" />}
                    variant="primary"
                    data-test="view-my-applications"
                    isLarge
                  >
                    View my applications
                  </Button>
                ) : undefined}
              </>
            )}
          </CardBody>
        </Card>
      </GridItem>
      <GridItem className="intro-banner__image" span={4} />
    </Grid>
  );
};

export default IntroBanner;
