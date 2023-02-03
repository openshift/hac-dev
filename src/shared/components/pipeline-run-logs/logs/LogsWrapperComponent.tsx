import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { WatchK8sResource } from '../../../../dynamic-plugin-sdk';
import { HttpError } from '../../../utils/error/http-error';
import { PodKind } from '../../types';
import { MultiStreamLogs } from './MultiStreamLogs';

type LogsWrapperComponentProps = {
  taskName: string;
  downloadAllLabel?: string;
  onDownloadAll?: () => Promise<Error>;
  resource: WatchK8sResource;
};

const LogsWrapperComponent: React.FC<LogsWrapperComponentProps> = ({ resource, ...props }) => {
  const resourceRef = React.useRef(null);
  const [obj, loaded, error] = useK8sWatchResource<PodKind>(resource);

  if (loaded && !error && resource.name === obj.metadata.name) {
    resourceRef.current = obj;
  } else if (error) {
    resourceRef.current = null;
  }

  let errorMessage;
  if ((error as HttpError)?.code === 404) {
    errorMessage = `Logs are no longer accessible for ${props.taskName} task`;
  }
  return (
    <MultiStreamLogs
      {...props}
      resourceName={resource?.name}
      resource={resourceRef.current}
      errorMessage={errorMessage}
    />
  );
};

export default LogsWrapperComponent;
