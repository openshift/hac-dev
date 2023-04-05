import * as React from 'react';
import {
  Bullseye,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { TableComposable, Thead, Tbody, Th, Td, Tr } from '@patternfly/react-table';
import { TektonResultsRun } from '../../../types';
import { handleURLs } from '../../../utils/render-utils';

import './RunResultsList.scss';

type Props = {
  results: TektonResultsRun[];
  status: string;
  compressed?: boolean;
};

const RunResultsList: React.FC<Props> = ({ results, status, compressed }) => (
  <DescriptionList
    className={css('run-results-list', compressed && 'm-compressed')}
    data-test="pipeline-run-details"
    columnModifier={{
      default: '1Col',
    }}
  >
    <DescriptionListGroup>
      <DescriptionListTerm>Results</DescriptionListTerm>
      <DescriptionListDescription>
        {status !== 'Failed' ? (
          <TableComposable aria-label="results">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map(({ name, value }) => (
                <Tr key={`row-${name}`}>
                  <Td className="run-results-list__key">{name}</Td>
                  <Td className="run-results-list__value">{handleURLs(value)}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        ) : (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.full}>
              <EmptyStateBody>No results available due to failure</EmptyStateBody>
            </EmptyState>
          </Bullseye>
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
);

export default RunResultsList;
