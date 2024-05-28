import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import ExternalLink from '../../shared/components/links/ExternalLink';

import './AboutSection.scss';

const AboutSection: React.FC<React.PropsWithChildren<unknown>> = () => (
  <Grid hasGutter>
    <GridItem sm={12} lg={8}>
      <Card isLarge>
        <CardTitle>About</CardTitle>
        <CardBody style={{ paddingLeft: '16px' }}>
          <Card isPlain isCompact>
            <CardTitle>Build</CardTitle>
            <CardBody>
              Build artifacts of all kinds from source. Enable hermetic builds and produce accurate
              SBOMs.
            </CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>Securely Sign</CardTitle>
            <CardBody>
              Generate secure & detailed provenance, an immutable record of what happened during
              each and every build step.
            </CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>Identify Vulnerabilities</CardTitle>
            <CardBody>Catch critical vulnerabilities quickly with each pull request.</CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>Supply Chain Safeguards</CardTitle>
            <CardBody>
              Verify container images against major secure software frameworks or your own custom
              rules.
            </CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>Integration Tests</CardTitle>
            <CardBody>
              Execute integration tests for complex applications and see results in your SCM.
            </CardBody>
          </Card>
          <Card isPlain isCompact>
            <CardTitle>SCM Integration</CardTitle>
            <CardBody>
              Build in response to git events, post results of builds and tests back to your Pull or
              Merge requests
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </GridItem>
    <GridItem sm={12} lg={4}>
      <Stack hasGutter>
        <StackItem>
          <Card isLarge>
            <CardTitle>Contact us</CardTitle>
            <CardBody>
              To talk to someone from the Konflux team, open an issue in our discussions{' '}
              <ExternalLink href="https://github.com/konflux-ci/discussions/issues">
                repository
              </ExternalLink>
              .
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </GridItem>
  </Grid>
);

export default AboutSection;
