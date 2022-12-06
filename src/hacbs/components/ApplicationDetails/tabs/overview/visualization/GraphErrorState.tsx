import * as React from 'react';
import { Alert, AlertActionCloseButton, Bullseye } from '@patternfly/react-core';
import { OutlinedEyeSlashIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-eye-slash-icon';
import { global_palette_black_600 as grayColor } from '@patternfly/react-tokens/dist/js/global_palette_black_600';
import cx from 'classnames';

import './GraphErrorState.scss';

type GraphErrorStateProps = {
  errors: unknown[];
  fullHeight?: boolean;
};

const GraphErrorState: React.FC<GraphErrorStateProps> = ({ errors, fullHeight }) => {
  const [closedError, setClosedError] = React.useState<number[]>([]);

  return (
    <>
      {errors.length > 0 && errors.length !== closedError.length && (
        <div className="hacbs-inline-errors" data-test="graph-error-state">
          {errors.map((e: { message: string }, key) => {
            return !closedError.includes(key) ? (
              <Alert
                key={key}
                variant="danger"
                isInline
                title={e.message}
                actionClose={
                  <AlertActionCloseButton
                    onClose={() => {
                      setClosedError([...closedError, key]);
                    }}
                  />
                }
              />
            ) : null;
          })}
        </div>
      )}

      <Bullseye className={cx('hacbs-graph-error-state', { 'full-height': fullHeight })}>
        <OutlinedEyeSlashIcon color={grayColor.value} size="md" />
      </Bullseye>
    </>
  );
};
export default GraphErrorState;
