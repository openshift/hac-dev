import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { PodGroupVersionKind } from '../../models/pod';
import { PodKind } from '../../shared/components/types';
import { ComponentKind } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { usePodLogViewerModal } from './PodLogViewer';

type PodLogsColumnProps = {
  component: ComponentKind;
  podSelector: any;
};

const PodLogsColumn: React.FC<PodLogsColumnProps> = ({ component, podSelector }) => {
  const { namespace } = useWorkspaceInfo();

  const [obj, loaded, error] = useK8sWatchResource<PodKind[]>({
    groupVersionKind: PodGroupVersionKind,
    selector: podSelector,
    namespace,
    isList: true,
  });

  const pod = React.useMemo(() => loaded && obj && obj.length > 0 && obj[0], [loaded, obj]);
  const podLogsModal = usePodLogViewerModal(pod);
  if (!podSelector) {
    return null;
  }
  if (!pod?.metadata) {
    return null;
  }

  if (error) {
    return <>{`${error}`}</>;
  }

  return (
    <Flex direction={{ default: 'column' }}>
      <FlexItem align={{ default: 'alignRight' }}>
        <Button
          onClick={podLogsModal}
          variant="link"
          data-test={`view-pod-logs-${component.metadata.name}`}
          isInline
        >
          View pod logs
        </Button>
      </FlexItem>
    </Flex>
  );
};

export default PodLogsColumn;
