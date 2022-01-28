import * as React from 'react';
import {
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
} from '@patternfly/react-core';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../types';
import './ComponentListItem.scss';

type ComponentListViewPageProps = {
  component: ComponentKind;
};

export const ComponentListItem: React.FC<ComponentListViewPageProps> = ({ component }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { replicas, targetPort, resources } = component.spec;
  const name = component.metadata.name;
  const resourceRequests = resources?.requests;

  return (
    <DataListItem aria-label={name} isExpanded={expanded}>
      <DataListItemRow>
        <DataListToggle id={name} onClick={() => setExpanded((x) => !x)} isExpanded={expanded} />
        <DataListItemCells
          dataListCells={[
            <DescriptionList key="name">
              <DescriptionListGroup>
                <DescriptionListTerm className="hacDev-component-list-item__name">
                  {name}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  Code Repo:{' '}
                  <ExternalLink
                    href={component.spec.source.git.url}
                    text={component.spec.source.git.url}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        className="hacDev-component-list-item__details"
        aria-label={`${name} details`}
        isHidden={!expanded}
      >
        <DescriptionList>
          {resourceRequests && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>
                  CPU/Mem Requests
                </DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
              <DescriptionListDescription>
                {`${resourceRequests.cpu}, ${resourceRequests.memory}`}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {replicas && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>Replicas</DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
              <DescriptionListDescription>{replicas}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {targetPort && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>Target Port</DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
              <DescriptionListDescription>{targetPort}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
      </DataListContent>
    </DataListItem>
  );
};
