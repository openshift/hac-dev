import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import MetadataList from '../MetadataList';

describe('GetMetadataList', () => {
  it('should render "-" for empty metadata', () => {
    render(<MetadataList metadata={null} />);
    screen.getByText('-');
  });

  it('should render only one ListItem', () => {
    render(<MetadataList metadata={{ [PipelineRunLabel.APPLICATION]: 'app' }} />);
    expect(screen.getAllByRole('listitem').length).toBe(1);
    expect(screen.getByText('appstudio.openshift.io/application=app'));
  });

  it('should render three items in List', () => {
    render(
      <MetadataList
        metadata={{
          [PipelineRunLabel.APPLICATION]: 'app',
          [PipelineRunLabel.PIPELINE_TYPE]: 'test',
          [PipelineRunLabel.COMMIT_SHA_TITLE_ANNOTATION]: 'abcd1234',
        }}
      />,
    );
    expect(screen.getAllByRole('listitem').length).toBe(3);
    expect(screen.getByText('appstudio.openshift.io/application=app'));
    expect(screen.getByText('pipelines.appstudio.openshift.io/type=test'));
    expect(screen.getByText('pipelinesascode.tekton.dev/sha-title=abcd1234'));
  });
});
