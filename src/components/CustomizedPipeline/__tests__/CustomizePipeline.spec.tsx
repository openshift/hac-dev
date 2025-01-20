import * as React from 'react';
import '@testing-library/jest-dom';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { usePipelineRuns } from '../../../hooks/usePipelineRuns';
import { ComponentKind } from '../../../types';
import {
  BuildRequest,
  BUILD_REQUEST_ANNOTATION,
  BUILD_STATUS_ANNOTATION,
  SAMPLE_ANNOTATION,
} from '../../../utils/component-utils';
import CustomizePipeline from '../CustomizePipelines';

jest.mock('../../../utils/analytics');

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  k8sPatchResource: jest.fn(() => Promise.resolve()),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/usePipelineRuns', () => ({
  usePipelineRuns: jest.fn(() => [[], true]),
}));

jest.mock('../../../hooks/useApplicationPipelineGitHubApp', () => ({
  useApplicationPipelineGitHubApp: jest.fn(() => ({
    name: 'test-app',
    url: 'https://github.com/test-app',
  })),
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const usePipelineRunsMock = usePipelineRuns as jest.Mock;
const k8sPatchResourceMock = k8sPatchResource as jest.Mock;

let componentCount = 1;
const createComponent = (
  pacValue?: 'done' | 'request-configure' | 'request-unconfigure' | 'error',
  sample?: boolean,
): ComponentKind =>
  ({
    metadata: {
      name: `my-component-${componentCount++}`,
      annotations: {
        [SAMPLE_ANNOTATION]: sample ? 'true' : undefined,
        [BUILD_REQUEST_ANNOTATION]:
          pacValue === 'request-configure'
            ? BuildRequest.configurePac
            : pacValue === 'request-unconfigure'
            ? BuildRequest.unconfigurePac
            : undefined,
        [BUILD_STATUS_ANNOTATION]: JSON.stringify(
          pacValue === 'done'
            ? { pac: { state: 'enabled', 'merge-url': 'example.com' } }
            : pacValue === 'request-configure'
            ? { pac: { state: 'disabled' } }
            : pacValue === 'error'
            ? {
                pac: {
                  state: 'error',
                  'error-message': '70: GitHub Application is not installed in user repository',
                },
              }
            : undefined,
        ),
      },
    },
    spec: {
      source: {
        git: {
          url: 'https://github.com/org/test',
        },
      },
    },
  } as any as ComponentKind);

describe('CustomizePipeline', () => {
  afterEach(() => {
    k8sPatchResourceMock.mockClear();
    usePipelineRunsMock.mockClear();
  });

  it('should render opt in', () => {
    const result = render(
      <CustomizePipeline
        components={[createComponent()]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const button = result.queryByRole('button', { name: 'Send pull request' });
    expect(button).toBeInTheDocument();

    act(() => {
      button.click();
    });

    expect(k8sPatchResourceMock).toHaveBeenCalled();
  });

  it('should render sending pull request', () => {
    const result = render(
      <CustomizePipeline
        components={[createComponent('request-configure')]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const button = result.getByRole('button', { name: /Sending pull request/ });
    expect(button).toBeInTheDocument();
  });

  it('should render rolling back', () => {
    const result = render(
      <CustomizePipeline
        components={[createComponent('request-unconfigure')]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const button = result.getByRole('button', { name: /Rolling back/ });
    expect(button).toBeInTheDocument();
  });

  it('should render pull request sent', () => {
    usePipelineRunsMock.mockReturnValue([[], true]);
    const result = render(
      <CustomizePipeline
        components={[createComponent('done')]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const button = result.queryByRole('link', { name: 'Merge in GitHub' });
    expect(button).toBeInTheDocument();
  });

  it('should render pull request merged', () => {
    usePipelineRunsMock.mockReturnValue([[{}], true]);
    const result = render(
      <CustomizePipeline
        components={[createComponent('done')]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const button = result.queryByRole('link', { name: 'Edit pipeline in GitHub' });
    expect(button).toBeInTheDocument();
  });

  it('should render resend pull request', () => {
    usePipelineRunsMock.mockReturnValue([[{}], true]);
    const result = render(
      <CustomizePipeline
        components={[createComponent('error')]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const button = result.getByRole('button', { name: 'Send pull request' });
    expect(button).toBeInTheDocument();
  });

  it('should render PAC error message', () => {
    usePipelineRunsMock.mockReturnValue([[{}], true]);
    render(
      <CustomizePipeline
        components={[createComponent('error')]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const message = screen.getByText('70: GitHub Application is not installed in user repository');
    expect(message).toBeInTheDocument();
  });

  it('should render install GitHub app alert', () => {
    usePipelineRunsMock.mockReturnValue([[{}], true]);
    const result = render(
      <CustomizePipeline
        components={[createComponent('error')]}
        onClose={() => {}}
        modalProps={{ isOpen: true }}
      />,
    );
    const link = result.getByRole('link', { name: /Install GitHub Application/ });
    expect(link).toBeInTheDocument();
    const button = result.getByRole('button', { name: 'Roll back to default pipeline' });
    expect(button).toBeInTheDocument();
  });

  it('should display upgrade status message', () => {
    expect(
      render(
        <CustomizePipeline
          components={[createComponent('request-configure')]}
          onClose={() => {}}
          modalProps={{ isOpen: true }}
        />,
      ).queryByText('0 of 1 component upgraded to custom build'),
    ).toBeInTheDocument();
  });

  it('should display upgrade status message for a single component', () => {
    expect(
      render(
        <CustomizePipeline
          components={[createComponent('request-configure')]}
          onClose={() => {}}
          modalProps={{ isOpen: true }}
        />,
      ).queryByText('0 of 1 component upgraded to custom build'),
    ).toBeInTheDocument();
  });

  it('should display upgrade status message for multiple components', () => {
    expect(
      render(
        <CustomizePipeline
          components={[createComponent(), createComponent(), createComponent(null, true)]}
          onClose={() => {}}
          modalProps={{ isOpen: true }}
        />,
      ).queryByText('0 of 2 components upgraded to custom build'),
    ).toBeInTheDocument();
  });

  it('should display completed upgrade message', () => {
    usePipelineRunsMock.mockReturnValue([[{}], true]);
    expect(
      render(
        <CustomizePipeline
          components={[createComponent('done')]}
          onClose={() => {}}
          modalProps={{ isOpen: true }}
        />,
      ).queryByText('1 of 1 component upgraded to custom build'),
    ).toBeInTheDocument();
  });

  it('should show git url when available in component', () => {
    usePipelineRunsMock.mockReturnValue([[{}], true]);
    render(
      <CustomizePipeline
        components={[createComponent('done')]}
        onClose={() => {}}
        modalProps={{ isOpen: true, title: 'test' }}
      />,
    );
    expect(screen.getByText('org/test')).toHaveAttribute('href', 'https://github.com/org/test');
  });

  it('should show container image url when available in component', () => {
    usePipelineRunsMock.mockReturnValue([[{}], true]);
    render(
      <CustomizePipeline
        components={[
          {
            spec: {
              application: 'my-component-test',
            },
            metadata: {
              name: 'my-component-test',
            },
            status: {
              containerImage: 'quay.io/org/test:latest',
              lastPromotedImage: 'quay.io/org/test:latest',
            },
          } as ComponentKind,
        ]}
        onClose={() => {}}
        modalProps={{ isOpen: true, title: 'test' }}
      />,
    );
    expect(screen.getByText('quay.io/org/test:latest')).toBeVisible();
  });
});
