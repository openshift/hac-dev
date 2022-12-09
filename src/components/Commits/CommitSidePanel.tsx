import React from 'react';
import { DrawerHead, DrawerPanelContent, DrawerPanelBody } from '@patternfly/react-core';
import { PipelineRunKind } from '../../types';
import CommitSidePanelBody from './CommitSidePanelBody';
import CommitSidePanelHeader, { SortedPLRList } from './CommitSidePanelHeader';

interface CommitSidePanelProps {
  drawerRef: React.Ref<HTMLElement>;
  isExpanded: boolean;
  onPanelCloseClick: () => void;
  commitStatus: string;
  selectedPipelineRun: PipelineRunKind;
  sortedPLRList: SortedPLRList;
  setSelectedPipelineRun: (plr: PipelineRunKind) => void;
}

const CommitSidePanel: React.FC<CommitSidePanelProps> = ({
  drawerRef,
  onPanelCloseClick,
  commitStatus,
  setSelectedPipelineRun,
  selectedPipelineRun,
  sortedPLRList,
}) => {
  const [currentStatus, setCurrentStatus] = React.useState<string>(commitStatus);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  const changeStatus = (status: string) => {
    status !== currentStatus && setCurrentStatus(status);
    const selectedPLR = sortedPLRList[status]?.length > 0 && sortedPLRList[status][0];
    setSelectedPipelineRun(selectedPLR ?? null);
    currentIndex !== 0 && setCurrentIndex(0);
  };

  const nextTask = () => {
    if (currentIndex < sortedPLRList[currentStatus].length - 1) {
      setSelectedPipelineRun(sortedPLRList[currentStatus][currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousTask = () => {
    if (currentIndex > 0) {
      setSelectedPipelineRun(sortedPLRList[currentStatus][currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <DrawerPanelContent>
      <DrawerHead>
        {sortedPLRList && (
          <CommitSidePanelHeader
            drawerRef={drawerRef}
            onPanelCloseClick={onPanelCloseClick}
            previousTask={previousTask}
            nextTask={nextTask}
            changeStatus={changeStatus}
            currentStatus={currentStatus}
            sortedPLRList={sortedPLRList}
            currentIndex={currentIndex}
          />
        )}
      </DrawerHead>
      <DrawerPanelBody>
        <CommitSidePanelBody selectedPipelineRun={selectedPipelineRun} />
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};

export default CommitSidePanel;
