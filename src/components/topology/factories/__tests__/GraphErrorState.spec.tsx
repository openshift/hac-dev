import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, render, configure } from '@testing-library/react';
import { CustomError } from '../../../../shared/utils/error/custom-error';
import GraphErrorState from '../GraphErrorState';

configure({ testIdAttribute: 'data-test' });

describe('GraphErrorState', () => {
  it('should not render graph error state', () => {
    render(<GraphErrorState errors={[]} />);
    expect(screen.queryByTestId('graph-error-state')).not.toBeInTheDocument();
  });

  it('should render graph error state', () => {
    render(<GraphErrorState errors={[new CustomError('Model does not exist')]} />);
    expect(screen.queryByTestId('graph-error-state')).toBeInTheDocument();
  });

  it('should render graph multiple errors', () => {
    render(
      <GraphErrorState
        errors={[
          new CustomError('Model does not exist'),
          new CustomError('Forbidden user permission'),
        ]}
      />,
    );
    expect(screen.queryAllByTestId('error')).toHaveLength(2);
  });

  it('should not render same error multiple times', () => {
    render(
      <GraphErrorState
        errors={[new CustomError('Model does not exist'), new CustomError('Model does not exist')]}
      />,
    );
    expect(screen.queryAllByTestId('error')).toHaveLength(1);
  });
});
