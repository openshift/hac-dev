import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import argoLogo from '../../imgs/overview/Argo.svg';
import clairLogo from '../../imgs/overview/Clair.svg';
import goLogo from '../../imgs/overview/Go.svg';
import javaLogo from '../../imgs/overview/Java.svg';
import nodeLogo from '../../imgs/overview/Nodejs.svg';
import openPolicyAgentLogo from '../../imgs/overview/OpenPolicyAgent.svg';
import pythonLogo from '../../imgs/overview/Python.svg';
import redhatLogo from '../../imgs/overview/RedHat.svg';
import tektonLogo from '../../imgs/overview/Tekton.svg';
import ExternalLink from '../../shared/components/links/ExternalLink';

import './AboutSection.scss';

type TechnologyTileProps = {
  name: string;
  logo: string;
};

const TechnologyTile: React.FC<React.PropsWithChildren<TechnologyTileProps>> = ({ name, logo }) => (
  <Split hasGutter>
    <SplitItem>
      <img src={logo} alt={`${name} logo`} className="technology-logo" />
    </SplitItem>
    <SplitItem isFilled>{name}</SplitItem>
  </Split>
);

const AboutSection: React.FC<React.PropsWithChildren<unknown>> = () => (
  <Grid hasGutter>
    <GridItem sm={12} lg={8}>
      <Card isLarge>
        <CardTitle>About</CardTitle>
        <CardBody style={{ paddingLeft: '16px' }}>
          <Card isPlain isCompact>
            <CardTitle>Source to Cloud</CardTitle>
            <CardBody>
              Create applications from your git repository or our bundled samples. Your applications
              will be automatically built then containerized with Red Hat’s secure runtime images
              and released with OpenShift.
            </CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>Shift Left for DevSecOps</CardTitle>
            <CardBody>
              Out-of-the-box support for{' '}
              <ExternalLink href="https://slsa.dev/spec/v1.0/levels">SLSA Level 3</ExternalLink>{' '}
              means you can identify critical vulnerabilities in your application much earlier with
              each pull request introspecting your direct and transitive dependencies.
            </CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>Add some GitOps</CardTitle>
            <CardBody>
              Add SDLC environments for your applications, each defined to deploy the application to
              a Red Hat OpenShift or Kubernetes cluster on your desired cloud platforms via GitOps.
              You can easily define deployment, scaling, and application settings for each
              environment.
            </CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>Become Continuous</CardTitle>
            <CardBody>
              You can continuously build, test, and rollout your containerized applications with a
              simple ‘git push’ or appearance of a pull request.
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </GridItem>
    <GridItem sm={12} lg={4}>
      <Stack hasGutter>
        <StackItem>
          <Card isLarge>
            <CardTitle>Related technologies</CardTitle>
            <CardBody>
              <TechnologyTile name="Node.js" logo={nodeLogo} />
              <TechnologyTile name="Clair" logo={clairLogo} />
              <TechnologyTile name="Python" logo={pythonLogo} />
              <TechnologyTile name="Java" logo={javaLogo} />
              <TechnologyTile name="Go" logo={goLogo} />
              <TechnologyTile name="Tekton" logo={tektonLogo} />
              <TechnologyTile name="Argo CD" logo={argoLogo} />
              <TechnologyTile name="Open Policy Agent" logo={openPolicyAgentLogo} />
              <TechnologyTile name="OpenShift" logo={redhatLogo} />
            </CardBody>
          </Card>
        </StackItem>
        <StackItem>
          <Card isLarge>
            <CardTitle>Contact us</CardTitle>
            <CardBody>
              Join the internal RedHat Slack workspace here:{' '}
              <ExternalLink href="https://redhat-internal.slack.com/" hideIcon>
                https://redhat-internal.slack.com/
              </ExternalLink>
              , and then join our{' '}
              <ExternalLink href="https://redhat.enterprise.slack.com/archives/C04PZ7H0VA8">
                #rhtap-users
              </ExternalLink>{' '}
              channel.
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </GridItem>
  </Grid>
);

export default AboutSection;
