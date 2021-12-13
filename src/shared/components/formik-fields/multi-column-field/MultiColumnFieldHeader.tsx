import React from 'react';
import { Grid, GridItem, gridItemSpanValueShape } from '@patternfly/react-core';
import './MultiColumnField.scss';

export interface MultiColumnFieldHeaderProps {
  headers: ({ name: string; required: boolean } | string)[];
  spans: gridItemSpanValueShape[];
}

const MultiColumnFieldHeader: React.FC<MultiColumnFieldHeaderProps> = ({ headers, spans }) => (
  <div className="hacDev-multi-column-field__header">
    <Grid className="hacDev-multi-column-field__header">
      {headers.map((header, i) => (
        <GridItem span={spans[i]} key={typeof header === 'string' ? header : header.name}>
          <div className="hacDev-multi-column-field__col">
            {typeof header === 'string' ? (
              header
            ) : (
              <>
                {header.name}
                {header.required && (
                  <span
                    className="hacDev-multi-column-field__header--required-label"
                    aria-hidden="true"
                  >
                    *
                  </span>
                )}
              </>
            )}
          </div>
        </GridItem>
      ))}
    </Grid>
    <div className="hacDev-multi-column-field__col--button" />
  </div>
);

export default MultiColumnFieldHeader;
