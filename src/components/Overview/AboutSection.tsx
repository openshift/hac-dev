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
import nodeLogo from '../../imgs/overview/Nodejs.svg';
import openPolicyAgentLogo from '../../imgs/overview/OpenPolicyAgent.svg';
import pythonLogo from '../../imgs/overview/Python.svg';
import redhatLogo from '../../imgs/overview/RedHat.svg';
import springLogo from '../../imgs/overview/Spring.svg';
import tektonLogo from '../../imgs/overview/Tekton.svg';
import ExternalLink from '../../shared/components/links/ExternalLink';

import './AboutSection.scss';

type TechnologyTileProps = {
  name: string;
  logo: string;
};

const TechnologyTile: React.FC<TechnologyTileProps> = ({ name, logo }) => (
  <Split hasGutter>
    <SplitItem>
      <img src={logo} alt={`${name} logo`} className="technology-logo" />
    </SplitItem>
    <SplitItem isFilled>{name}</SplitItem>
  </Split>
);

const AboutSection: React.FC = () => (
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
              and deployed into a cloud hosted development environment with OpenShift.
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
              You can run your containerized applications in the bundled, shared Kubernetes-based
              environments that are powered by Red Hat OpenShift. You can share the routes created
              for your services and you can continuously build, test, and rollout your applications
              with a simple `git push` or acceptance of a pull request.
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
              <TechnologyTile name="Spring" logo={springLogo} />
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
              Join the DevNation Slack workspace here:{' '}
              <ExternalLink href="https://dn.dev/slack" hideIcon>
                https://dn.dev/slack
              </ExternalLink>
              , and then join our{' '}
              <ExternalLink href="https://rhdevnation.slack.com/channels/software-supply-chain-security">
                #software-supply-chain-security
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
