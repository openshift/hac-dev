import * as React from 'react';
import {
  Button,
  ButtonVariant,
  DrawerActions,
  DrawerCloseButton,
  Dropdown,
  DropdownItem,
  DropdownToggle,
} from '@patternfly/react-core';
import AngleDownIcon from '@patternfly/react-icons/dist/js/icons/angle-down-icon';
import AngleUpIcon from '@patternfly/react-icons/dist/js/icons/angle-up-icon';
import { PipelineRunKind } from '../../types';
import { statuses } from '../../utils/commits-utils';
import { runStatus } from '../../utils/pipeline-utils';

export type SortedPLRList = Partial<Record<runStatus, PipelineRunKind[]>>;

interface CommitSidePanelHeaderProps {
  drawerRef: React.Ref<HTMLElement>;
  currentStatus: string;
  sortedPLRList: SortedPLRList;
  changeStatus: (status: string) => void;
  currentIndex: number;
  nextTask: () => void;
  previousTask: () => void;
  onPanelCloseClick: () => void;
}

const CommitSidePanelHeader: React.FC<CommitSidePanelHeaderProps> = ({
  drawerRef,
  currentStatus,
  sortedPLRList,
  changeStatus,
  currentIndex,
  nextTask,
  previousTask,
  onPanelCloseClick,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggle = (isDropdownOpen: boolean) => {
    setIsOpen(isDropdownOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  const dropdownItems = statuses.map((status) => (
    <DropdownItem
      onClick={() => {
        changeStatus(status);
      }}
      key={status}
    >
      {status}
    </DropdownItem>
  ));

  return (
    <>
      <span ref={drawerRef}>
        <Dropdown
          onSelect={onSelect}
          toggle={
            <DropdownToggle id="toggle-basic" onToggle={onToggle}>
              {currentStatus}
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={dropdownItems}
        />
        {sortedPLRList[currentStatus]?.length > 0 && (
          <span className="pf-u-ml-xs pf-u-mr-xs" data-test="plr-count">
            {`${currentIndex + 1}/${sortedPLRList[currentStatus].length}`}
          </span>
        )}
        <Button
          variant={ButtonVariant.control}
          className="pf-u-p-sm"
          isDisabled={
            sortedPLRList[currentStatus]
              ? currentIndex >= sortedPLRList[currentStatus].length - 1
              : true
          }
          onClick={nextTask}
          data-test="next-plr-button"
        >
          <AngleDownIcon />
        </Button>
        <Button
          variant={ButtonVariant.control}
          className="pf-u-p-sm"
          isDisabled={currentIndex < 1}
          onClick={previousTask}
          data-test="previous-plr-button"
        >
          <AngleUpIcon />
        </Button>
      </span>
      <DrawerActions>
        <DrawerCloseButton onClick={onPanelCloseClick} />
      </DrawerActions>
    </>
  );
};

export default CommitSidePanelHeader;
