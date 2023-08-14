import * as React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Skeleton,
} from '@patternfly/react-core';
import usePACState, { PACState } from '../../../../hooks/usePACState';
import { ComponentKind } from '../../../../types';
import ComponentBuildTrigger from '../../ComponentBuildTrigger';
import ComponentPACStateLabel from '../../ComponentPACStateLabel';

type ComponentBuildSettingsProps = {
  component: ComponentKind;
};

const ComponentBuildSettings: React.FC<ComponentBuildSettingsProps> = ({ component }) => {
  const pacState = usePACState(component);

  return (
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
              {pacState === PACState.loading ? (
                <Skeleton width="25%" screenreaderText="Loading component count" />
              ) : (
                <ComponentPACStateLabel component={component} enableAction />
              )}
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
            <DescriptionListTerm>Build trigger</DescriptionListTerm>
            <DescriptionListDescription>
              <ComponentBuildTrigger pacState={pacState} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </FlexItem>
    </Flex>
  );
};

export default React.memo(ComponentBuildSettings);
