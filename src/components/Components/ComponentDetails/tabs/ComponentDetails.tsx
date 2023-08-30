import * as React from 'react';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import yamlParser from 'js-yaml';
import { ComponentKind } from '../../../../types';
import GitRepoLink from '../../../GitLink/GitRepoLink';

type ComponentDetailsProps = {
  component: ComponentKind;
};

const ComponentDetails: React.FC<ComponentDetailsProps> = ({ component }) => {
  const runTime = React.useMemo(() => {
    try {
      const loadedYaml = yamlParser?.load(component.status?.devfile) as {
        metadata: { projectType: string; displayName: string; name: string };
      };
      return (
        loadedYaml?.metadata.projectType ||
        loadedYaml?.metadata.displayName ||
        loadedYaml?.metadata.name ||
        'N/A'
      );
    } catch {
      return 'N/A';
    }
  }, [component]);

  return (
    <Flex direction={{ default: 'row' }}>
      <FlexItem style={{ flex: 1 }}>
        <DescriptionList
          columnModifier={{
            default: '1Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Source code</DescriptionListTerm>
            <DescriptionListDescription>
              <GitRepoLink
                url={component.spec.source?.git?.url}
                revision={component.spec.source?.git?.revision}
                context={component.spec.source?.git?.context}
              />
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </FlexItem>
      <FlexItem style={{ flex: 1 }}>
        <DescriptionList
          data-test="component-details-2"
          columnModifier={{
            default: '1Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Runtime</DescriptionListTerm>
            <DescriptionListDescription>{runTime}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </FlexItem>
    </Flex>
  );
};

export default ComponentDetails;
