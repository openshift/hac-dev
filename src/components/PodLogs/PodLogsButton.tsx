import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Button, Tooltip } from '@patternfly/react-core';
import { PodGroupVersionKind } from '../../models/pod';
import { PodKind } from '../../shared/components/types';
import { ComponentKind } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { usePodLogViewerModal } from './PodLogViewer';

type PodLogsButtonProps = {
  component: ComponentKind;
  podSelector: any;
  showDisabled?: boolean;
};

const PodLogsButton: React.FC<React.PropsWithChildren<PodLogsButtonProps>> = ({
  component,
  podSelector,
  showDisabled,
}) => {
  const { namespace } = useWorkspaceInfo();

  const [obj, loaded, error] = useK8sWatchResource<PodKind[]>({
    groupVersionKind: PodGroupVersionKind,
    selector: podSelector,
    namespace,
    isList: true,
  });

  const pod = React.useMemo(() => loaded && obj && obj.length > 0 && obj[0], [loaded, obj]);
  const podLogsModal = usePodLogViewerModal(pod);
  const disabled = !podSelector || !pod?.metadata;

  if (disabled && !showDisabled) {
    return null;
  }

  if (error) {
    return <>{`${error}`}</>;
  }

  const logButton = (
    <Button
      onClick={podLogsModal}
      variant="link"
      data-test={`view-pod-logs-${component.metadata.name}`}
      isInline
      isDisabled={!podSelector || !pod?.metadata}
    >
      View pod logs
    </Button>
  );

  if (disabled) {
    return <Tooltip content="Pod logs are not available">{logButton}</Tooltip>;
  }
  return logButton;
};

export default PodLogsButton;
