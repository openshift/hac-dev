import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import DotCircleIcon from '@patternfly/react-icons/dist/js/icons/dot-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { ExpandableRowContent, Tbody, Td, Tr } from '@patternfly/react-table';
import { global_danger_color_100 as redColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import { global_success_color_100 as greenColor } from '@patternfly/react-tokens/dist/js/global_success_color_100';
import { global_warning_color_100 as yellowColor } from '@patternfly/react-tokens/dist/js/global_warning_color_100';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ENTERPRISE_CONTRACT_STATUS, UIEnterpriseContractData } from '../types';

type EnterpriseContractRowType = {
  data: UIEnterpriseContractData;
  rowIndex: number;
};

const getRuleStatus = (type: ENTERPRISE_CONTRACT_STATUS) => {
  switch (type) {
    case ENTERPRISE_CONTRACT_STATUS.successes:
      return (
        <>
          <CheckCircleIcon
            color={greenColor.value}
            style={{ marginRight: 'var(--pf-global--spacer--sm)', verticalAlign: 'middle' }}
          />
          {ENTERPRISE_CONTRACT_STATUS.successes}{' '}
        </>
      );
    case ENTERPRISE_CONTRACT_STATUS.violations:
      return (
        <>
          <ExclamationCircleIcon
            color={redColor.value}
            style={{ marginRight: 'var(--pf-global--spacer--sm)', verticalAlign: 'middle' }}
          />
          {ENTERPRISE_CONTRACT_STATUS.violations}
        </>
      );
    case ENTERPRISE_CONTRACT_STATUS.warnings:
      return (
        <>
          <ExclamationTriangleIcon
            color={yellowColor.value}
            style={{ marginRight: 'var(--pf-global--spacer--sm)', verticalAlign: 'middle' }}
          />
          {ENTERPRISE_CONTRACT_STATUS.warnings}
        </>
      );
    default:
      return (
        <>
          <DotCircleIcon /> Missing
        </>
      );
  }
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
        <Td>{data.title}</Td>
        <Td>{getRuleStatus(data.status)}</Td>
        <Td>{data.timestamp ? <Timestamp timestamp={data.timestamp} /> : '-'}</Td>
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
              columnModifier={{
                default: '2Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Rule Description</DescriptionListTerm>
                <DescriptionListDescription>{data.description}</DescriptionListDescription>
              </DescriptionListGroup>
              {data.status !== ENTERPRISE_CONTRACT_STATUS.successes ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Failure Message</DescriptionListTerm>
                  <DescriptionListDescription>{data.msg}</DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
            </DescriptionList>
          </ExpandableRowContent>
        </Td>
      </Tr>
    </Tbody>
  );
};
