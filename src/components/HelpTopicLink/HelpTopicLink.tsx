import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

type HelpTopicLinkProps = {
  topicId: string;
};

export const HelpTopicLink: React.FC<HelpTopicLinkProps> = ({ topicId, children }) => {
  const {
    helpTopics: { setActiveTopic, enableTopics, disableTopics },
  } = useChrome();

  React.useEffect(() => {
    enableTopics(topicId);

    return () => disableTopics(topicId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button variant={ButtonVariant.link} onClick={() => setActiveTopic(topicId)} isInline>
      {children}
    </Button>
  );
};
