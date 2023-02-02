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
import clairLogo from '../../imgs/overview/Clair.svg';
import nodeLogo from '../../imgs/overview/Nodejs.svg';
import openPolicyAgentLogo from '../../imgs/overview/OpenPolicyAgent.svg';
import pythonLogo from '../../imgs/overview/Python.svg';
import redhatLogo from '../../imgs/overview/RedHat.svg';
import springLogo from '../../imgs/overview/Spring.svg';
import tektonLogo from '../../imgs/overview/Tekton.svg';

const AboutSection = () => (
  <Grid hasGutter>
    <GridItem span={8}>
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
              <a href="https://slsa.dev/spec/v0.1/levels" target="_blank" rel="noreferrer">
                SLSA Level 3
              </a>{' '}
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
              for your services and you can continuously build, test and rollout your applications
              with a simple `git push` or acceptance of a pull request.
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </GridItem>
    <GridItem span={4}>
      <Stack hasGutter>
        <StackItem>
          <Card isLarge>
            <CardTitle>Related technologies</CardTitle>
            <CardBody>
              <Split hasGutter>
                <SplitItem>
                  <img src={nodeLogo} alt="Icon" width="30px" height="30px" />
                </SplitItem>
                <SplitItem isFilled>Node.js</SplitItem>
              </Split>
              <Split hasGutter>
                <SplitItem>
                  <img src={clairLogo} alt="Icon" width="30px" height="30px" />
                </SplitItem>
                <SplitItem isFilled>Clair</SplitItem>
              </Split>
              <Split hasGutter>
                <SplitItem>
                  <img src={pythonLogo} alt="Icon" width="30px" height="30px" />
                </SplitItem>
                <SplitItem isFilled>Python</SplitItem>
              </Split>
              <Split hasGutter>
                <SplitItem>
                  <img src={springLogo} alt="Icon" width="30px" height="30px" />
                </SplitItem>
                <SplitItem isFilled>Spring</SplitItem>
              </Split>
              <Split hasGutter>
                <SplitItem>
                  <img src={tektonLogo} alt="Icon" width="30px" height="30px" />
                </SplitItem>
                <SplitItem isFilled>Tekton</SplitItem>
              </Split>
              <Split hasGutter>
                <SplitItem>
                  <img src={openPolicyAgentLogo} alt="Icon" width="30px" height="30px" />
                </SplitItem>
                <SplitItem isFilled>Open Policy Agent</SplitItem>
              </Split>
              <Split hasGutter>
                <SplitItem>
                  <img src={redhatLogo} alt="Icon" width="30px" height="30px" />
                </SplitItem>
                <SplitItem isFilled>OpenShift</SplitItem>
              </Split>
            </CardBody>
          </Card>
        </StackItem>
        <StackItem>
          <Card isLarge>
            <CardTitle>Contact us</CardTitle>
            <CardBody>
              Join the{' '}
              <a href="https://rhdevnation.slack.com/join/" target="_blank" rel="noreferrer">
                #software-supply-chain-security
              </a>{' '}
              channel on Slack
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </GridItem>
  </Grid>
);

export default AboutSection;
