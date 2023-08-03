import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Truncate,
} from '@patternfly/react-core';
import { ExpandableRowContent, Tbody, Td, Tr } from '@patternfly/react-table';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { UIEnterpriseContractData } from '../types';
import { getRuleStatus } from '../utils';

type EnterpriseContractRowType = {
  data: UIEnterpriseContractData;
  rowIndex: number;
};

export const EnterpriseContractRow: React.FC<EnterpriseContractRowType> = ({ data, rowIndex }) => {
  const [rowExpanded, setRowExpanded] = React.useState<boolean>(false);
  const { workspace } = useWorkspaceInfo();
  const { appName } = useParams();

  return (
    <Tbody isExpanded={rowExpanded}>
      <Tr>
        <Td
          data-testid="ec-expand-row"
          expand={{
            rowIndex,
            isExpanded: rowExpanded,
            onToggle: () => setRowExpanded((e) => !e),
          }}
        />
        <Td>{data.title ?? '-'}</Td>
        <Td data-testid="rule-status">{getRuleStatus(data.status)}</Td>
        <Td>{data.msg ? <Truncate content={data.msg} /> : '-'}</Td>
        <Td>
          <Link
            to={`/application-pipeline/workspaces/${workspace}/applications/${appName}/components`}
          >
            {data.component}
          </Link>
        </Td>
      </Tr>
      <Tr isExpanded={rowExpanded}>
        <Td />
        <Td colSpan={4}>
          <ExpandableRowContent>
            <DescriptionList
              isAutoColumnWidths
              columnModifier={{
                default: '3Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Rule Description</DescriptionListTerm>
                <DescriptionListDescription>{data.description ?? '-'}</DescriptionListDescription>
              </DescriptionListGroup>
              {data.collection && data.collection?.length ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Collection</DescriptionListTerm>
                  <DescriptionListDescription>
                    <ExternalLink href="https://enterprisecontract.dev/docs/ec-policies/release_policy.html#_available_rule_collections">
                      {data.collection.join(', ')}
                    </ExternalLink>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
              {data.solution ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Solution</DescriptionListTerm>
                  <DescriptionListDescription>{data.solution}</DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
              {data.timestamp ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Effective from</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Timestamp timestamp={data.timestamp} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
            </DescriptionList>
          </ExpandableRowContent>
        </Td>
      </Tr>
    </Tbody>
  );
};
