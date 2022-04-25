import * as React from 'react';
import { Card, CardTitle, CardBody, ListItem, List } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons';

import './SignupBanner.scss';

const SignupBanner: React.FC = () => {
  return (
    <Card className="signup-banner" isLarge>
      <CardTitle>Get Started with Red Hat App Studio</CardTitle>
      <CardBody>
        Red Hat App Studio is a fully managed experience that makes easier and faster for developers
        to iterate and deploy their applications as containers across multiple cloud environments.
      </CardBody>
      <CardBody>
        <List isPlain>
          <ListItem icon={<CheckIcon color="var(--pf-global--primary-color--100)" />}>
            Easy to use experience for managing your containerized applications.
          </ListItem>
          <ListItem icon={<CheckIcon color="var(--pf-global--primary-color--100)" />}>
            Simplified multi-cloud deployments that automatically scales to your needs.
          </ListItem>
          <ListItem icon={<CheckIcon color="var(--pf-global--primary-color--100)" />}>
            Reduced efforts with our fully managed services.
          </ListItem>
        </List>
      </CardBody>
    </Card>
  );
};

export default SignupBanner;
