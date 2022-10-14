import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { PipelineRunDetailsView } from '../PipelineRunDetailsView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

const pipelineRunName = 'java-springboot-sample-b4trz';
const mockApplication = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    annotations: {},
    creationTimestamp: '2022-04-11T19:36:25Z',
    finalizers: ['chains.tekton.dev/pipelinerun', 'pipelineruns.tekton.dev'],
    name: 'java-springboot-sample-b4trz',
    namespace: 'test',
    resourceVersion: '933786813',
    uid: 'f5dff823-52c5-43ee-a7de-a05915357689',
    labels: {
      'build.appstudio.openshift.io/component': 'java-springboot-sample',
    },
  },
  spec: {
    appModelRepository: {
      url: '',
    },
    displayName: 'Test Application',
    gitOpsRepository: {
      url: '',
    },
  },
  status: {
    conditions: [
      {
        startTime: '2022-08-04T16:23:43Z',
        completionTime: '2022-08-04T16:24:02Z',
      },
    ],
  },
};

describe('PipelineRunDetailsView', () => {
  it('should render spinner if pipelinerun data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getByRole('progressbar');
  });

  it('should render application display name if application data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValue([[], true]);
    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getAllByText(pipelineRunName);
  });

  it('should render application if components data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValue([[], true]);
    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    expect(screen.queryByText('Pipeline run details')).toBeInTheDocument();
    expect(screen.queryByText('Status')).toBeInTheDocument();
    expect(screen.queryByText('Message')).toBeInTheDocument();
    expect(screen.queryByText('Namespace')).toBeInTheDocument();
    expect(screen.queryByText('Message')).toBeInTheDocument();
  });
});
