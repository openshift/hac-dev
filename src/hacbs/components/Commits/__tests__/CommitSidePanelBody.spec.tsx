import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import CommitSidePanelBody from '../CommitSidePanelBody';

describe('CommitSidePanelBody', () => {
  it('should render proper info for type build', () => {
    render(<CommitSidePanelBody selectedPipelineRun={pipelineWithCommits[0]} />);
    screen.getByText('Build');
  });
  it('should render proper info for type release', () => {
    render(<CommitSidePanelBody selectedPipelineRun={pipelineWithCommits[1]} />);
    screen.getByText('Release');
    screen.getByText('-');
  });
  it('should render proper info for type test', () => {
    render(<CommitSidePanelBody selectedPipelineRun={pipelineWithCommits[3]} />);
    screen.getByText('Integration test');
  });
});
