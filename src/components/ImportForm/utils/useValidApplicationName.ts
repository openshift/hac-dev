import * as React from 'react';
import gitUrlParse from 'git-url-parse';
import { useApplications } from '../../../hooks/useApplications';
import { ApplicationKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

const BASE_NAME = 'my-app';

export const incrementNameCount = (
  applications: ApplicationKind[],
  prefferedName?: string,
): string => {
  let name = prefferedName || BASE_NAME,
    i = 1;
  while (applications.some((app) => app.metadata.name === name)) {
    name = `${prefferedName || BASE_NAME}-${i}`;
    i++;
  }
  return name;
};

export const useValidApplicationName = (url?: string): [string, boolean, unknown] => {
  const { namespace } = useWorkspaceInfo();

  const [applications, loaded, loadErr] = useApplications(namespace);
  let appName;
  if (url) {
    try {
      const { name } = gitUrlParse(url);
      appName = name;
    } catch {
      // ignore, should never happen when isRepoAccessible is true, but for tests it is not valid
    }
  }

  const validName = React.useMemo(() => {
    if (!loaded) {
      return;
    }
    return incrementNameCount(applications, appName);
  }, [appName, applications, loaded]);

  return [validName, loaded, loadErr];
};
