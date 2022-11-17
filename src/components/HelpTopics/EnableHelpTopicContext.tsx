import * as React from 'react';
import { HelpTopicContext } from '@patternfly/quickstarts';
import { useChromeHelpTopicsApi } from './help-topics';

type EnableHelpTopicContextType = {
  addTopicName: (topicName: string) => void;
  deleteTopicName: (topicName: string) => void;
};

const EnableHelpTopicContext = React.createContext<EnableHelpTopicContextType>({
  addTopicName: () => {},
  deleteTopicName: () => {},
});

export const EnableHelpTopicContextProvider: React.FC = ({ children }) => {
  const [helpTopics, setHelpTopics] = React.useState<string[]>([]);
  const { enableTopics, disableTopics, setActiveTopic } = useChromeHelpTopicsApi();
  const addTopicName = React.useCallback((topicName: string) => {
    setHelpTopics((prevTopicNames) => [...prevTopicNames, topicName]);
  }, []);

  const deleteTopicName = React.useCallback(
    (topicName: string) => {
      setHelpTopics((prevTopics) => {
        if (prevTopics.includes(topicName)) {
          return prevTopics.filter((topic) => topic !== topicName);
        }
        return prevTopics;
      });
      disableTopics(topicName);
    },
    [disableTopics],
  );

  const { activeHelpTopic } = React.useContext(HelpTopicContext);

  React.useEffect(() => {
    helpTopics.length > 0 &&
      enableTopics(...helpTopics).then(() => {
        activeHelpTopic !== null && setActiveTopic(helpTopics[0]);
      });

    return () => {
      helpTopics.length > 0 && disableTopics(helpTopics);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpTopics]);

  return (
    <EnableHelpTopicContext.Provider value={{ addTopicName, deleteTopicName }}>
      {children}
    </EnableHelpTopicContext.Provider>
  );
};

export const useEnableHelpTopicContextValues = () => null;

export const useEnableHelpTopicContext = () => React.useContext(EnableHelpTopicContext);
