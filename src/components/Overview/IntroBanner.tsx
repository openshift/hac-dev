import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
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
import { FULL_APPLICATION_TITLE } from '../../consts/labels';
import { useSignupStatus } from '../../hooks/useSignupStatus';
import {
  ApplicationGroupVersionKind,
  ApplicationModel,
  ComponentDetectionQueryModel,
  ComponentModel,
} from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { AccessReviewResources, ApplicationKind } from '../../types';
import { useAccessReviewForModels } from '../../utils/rbac';
import { SignupStatus } from '../../utils/signup-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import SignupButton from './SignupButton';

import './IntroBanner.scss';

const accessReviewResources: AccessReviewResources = [
  { model: ApplicationModel, verb: 'create' },
  { model: ComponentModel, verb: 'create' },
  { model: ComponentDetectionQueryModel, verb: 'create' },
];

const IntroBanner: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { namespace, workspace } = useWorkspaceInfo();
  const [canCreate] = useAccessReviewForModels(accessReviewResources);

  const signupStatus = useSignupStatus();

  const [applications, applicationsLoaded] = useK8sWatchResource<ApplicationKind[]>(
    signupStatus === SignupStatus.SignedUp && namespace
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
              Get started with {FULL_APPLICATION_TITLE}
            </Title>
          </CardTitle>
          <CardBody>
            <Text>
              Import, containerize, and release. With just a few clicks, you can interact with your
              application running in OpenShift and Kubernetes. Build here, go anywhere.
            </Text>
          </CardBody>
          <CardBody>
            {signupStatus === SignupStatus.SignedUp && (
              <>
                <ButtonWithAccessTooltip
                  className="intro-banner__cta"
                  component={(props) => (
                    <Link {...props} to={`/application-pipeline/workspaces/${workspace}/import`} />
                  )}
                  variant="primary"
                  data-test="create-application"
                  isDisabled={!canCreate}
                  tooltip="You don't have access to create an application"
                  size="lg"
                  analytics={{
                    link_name: 'create-application',
                  }}
                >
                  Create application
                </ButtonWithAccessTooltip>
                {applicationsLoaded && applications?.length > 0 ? (
                  <Button
                    className="intro-banner__cta"
                    component={(props) => <Link {...props} to="/application-pipeline/workspaces" />}
                    variant="secondary"
                    data-test="view-my-applications"
                    size="lg"
                  >
                    View my applications
                  </Button>
                ) : undefined}
              </>
            )}
            {signupStatus === SignupStatus.PendingApproval && (
              <Alert
                variant="info"
                isInline
                title="We have received your request. While you are waiting, please join our Slack channel."
              >
                <p>
                  We are working hard to get you early access. After we approve your request, we
                  will send you an email notification with information about how you can access and
                  start using the service.
                </p>
                <p>
                  Join the internal Red Hat Slack workspace here:{' '}
                  <ExternalLink href="https://redhat-internal.slack.com/" hideIcon>
                    https://redhat-internal.slack.com/
                  </ExternalLink>
                  , and then join our{' '}
                  <ExternalLink href="https://app.slack.com/client/E030G10V24F/C04PZ7H0VA8">
                    #konflux-users
                  </ExternalLink>{' '}
                  channel.
                </p>
              </Alert>
            )}
            {signupStatus === SignupStatus.NotSignedUp && <SignupButton />}
          </CardBody>
        </Card>
      </GridItem>
      <GridItem className="intro-banner__image" span={4} />
    </Grid>
  );
};

export default IntroBanner;
