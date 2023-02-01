import * as React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { TableComposable, Thead, Tbody, Th, Td, Tr } from '@patternfly/react-table';
import { TektonResultsRun } from '../../../types';
import { handleURLs } from '../../../utils/render-utils';

type Props = {
  results: TektonResultsRun[];
  status: string;
};

const RunResultsList: React.FC<Props> = ({ results, status }) => (
  <>
    <Title headingLevel="h2" size="lg">
      Results
    </Title>
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
              <Td>{name}</Td>
              <Td>{handleURLs(value)}</Td>
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
  </>
);

export default RunResultsList;
