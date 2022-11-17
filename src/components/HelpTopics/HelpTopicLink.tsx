import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { useEnableHelpTopicContext } from './EnableHelpTopicContext';
import { useChromeHelpTopicsApi } from './help-topics';

type HelpTopicLinkProps = {
  topicId: string;
};

export const HelpTopicLink: React.FC<HelpTopicLinkProps> = ({ topicId, children }) => {
  const { setActiveTopic } = useChromeHelpTopicsApi();
  const { addTopicName, deleteTopicName } = useEnableHelpTopicContext();

  React.useEffect(() => {
    addTopicName(topicId);
    return () => {
      deleteTopicName(topicId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button variant={ButtonVariant.link} onClick={() => setActiveTopic(topicId)} isInline>
      {children}
    </Button>
  );
};
