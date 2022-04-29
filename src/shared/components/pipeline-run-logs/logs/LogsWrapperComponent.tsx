import * as React from 'react';
import { useK8sWatchResource, WatchK8sResource } from '../../../../dynamic-plugin-sdk';
import { LoadingBox } from '../../status-box/StatusBox';
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
  }

  return resourceRef.current ? (
    <MultiStreamLogs {...props} resourceName={resource.name} resource={resourceRef.current} />
  ) : (
    <LoadingBox />
  );
};

export default LogsWrapperComponent;
