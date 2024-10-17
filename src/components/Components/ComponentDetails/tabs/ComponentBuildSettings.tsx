import * as React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import HelpPopover from '../../../../../src/components/HelpPopover';
import usePACState, { PACState } from '../../../../hooks/usePACState';
import { ComponentKind } from '../../../../types';
import ComponentPACStateLabel from '../../ComponentPACStateLabel';

type ComponentBuildSettingsProps = {
  component: ComponentKind;
};

export const getHelpPopoverText = (pacState) => {
  return pacState === PACState.disabled
    ? 'Trigger a new build manually from the component’s action menu. To enable an automatic trigger with every commit, upgrade to the Custom build pipeline plan.'
    : 'A new build pipeline run is automatically triggered with every commit to the source code.';
};

export const getBuildTriggerText = (pacState) => {
  return pacState === PACState.disabled ? 'Manual' : 'Automatic';
};

const ComponentBuildSettings: React.FC<React.PropsWithChildren<ComponentBuildSettingsProps>> = ({
  component,
}) => {
  const pacState = usePACState(component);
  const helpPopoverText = getHelpPopoverText(pacState);
  const buildTriggerText = getBuildTriggerText(pacState);

  return (
    <>
      <Flex direction={{ default: 'row' }}>
        <FlexItem style={{ flex: 1 }}>
          <DescriptionList
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Build pipeline plan</DescriptionListTerm>
              <DescriptionListDescription data-test="edit-build-pipeline">
                <ComponentPACStateLabel component={component} enableAction />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
        <FlexItem style={{ flex: 1 }}>
          <DescriptionList
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>
                Build trigger <HelpPopover bodyContent={helpPopoverText} />
              </DescriptionListTerm>
              <DescriptionListDescription>{buildTriggerText}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
      </Flex>
    </>
  );
};

export default React.memo(ComponentBuildSettings);
