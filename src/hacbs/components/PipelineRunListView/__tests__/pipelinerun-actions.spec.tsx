import * as React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PipelineRunKind } from '../../../types';
import PipelineRunListRow from '../PipelineRunListRow';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  k8sPatchResource: jest.fn(),
}));

const patchResourceMock = k8sPatchResource as jest.Mock;

const pipelineRun: PipelineRunKind = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    name: '1-nodejs-2bwzn',
    uid: '94c9a362-f5a5-4e67-b642-c61c6d1134dc',
    namespace: 'karthik-jk',
    labels: {
      'build.appstudio.openshift.io/component': '1-nodejs',
      'pipelines.openshift.io/runtime': 'generic',
      'pipelines.openshift.io/strategy': 'docker',
      'tekton.dev/pipeline': 'docker-build',
      'pipelines.openshift.io/used-by': 'build-cloud',
      'pipelinesascode.tekton.dev/sha': '010101010110',
      'build.appstudio.openshift.io/build': 'true',
      'build.appstudio.openshift.io/application': 'frontend-app',
      'build.appstudio.openshift.io/type': 'build',
      'pipelines.appstudio.openshift.io/type': 'build',
      'build.appstudio.openshift.io/version': '0.1',
    },
    annotations: {
      'build.appstudio.openshift.io/component': '1-nodejs',
      'pipelines.openshift.io/runtime': 'generic',
    },
  },
  spec: {
    params: [
      {
        name: 'git-url',
        value: 'https://github.com/karthikjeeyar/demo-app',
      },
      {
        name: 'output-image',
        value: '',
      },
      {
        name: 'dockerfile',
        value: 'Dockerfile',
      },
      {
        name: 'path-context',
        value: '.',
      },
    ],
    pipelineRef: {
      bundle:
        'quay.io/redhat-appstudio/build-templates-bundle:19cf17aa63a1c65eee897af8430dbb9c1682d77a',
      name: 'docker-build',
    },
    serviceAccountName: 'pipeline',
    timeout: '1h0m0s',
    workspaces: [
      {
        name: 'workspace',
        persistentVolumeClaim: {
          claimName: 'appstudio',
        },
        subPath: '1-nodejs/initialbuild-2022-Feb-13_12-39-17',
      },
      {
        name: 'registry-auth',
        secret: {
          secretName: 'redhat-appstudio-registry-pull-secret',
        },
      },
    ],
  },
  status: {
    completionTime: '2022-08-18T19:30:34Z',
    conditions: [
      {
        lastTransitionTime: '2022-08-18T19:30:34Z',
        message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 0',
        reason: 'Succeeded',
        status: ' ',
        type: 'Succeeded',
      },
    ],
    pipelineResults: [
      {
        name: 'IMAGE_URL',
        value: 'quay.io/redhat-appstudio/user-workload:mfrances-python\n',
      },
      {
        name: 'IMAGE_DIGEST',
        value: 'sha256:4ac978ffc5679793b6056b5e15c1f8c6cd4c3f980a48a55119cdb59afcb2323f',
      },
      {
        name: 'CHAINS-GIT_URL',
        value: 'https://github.com/devfile-samples/devfile-sample-python-basic',
      },
      {
        name: 'CHAINS-GIT_COMMIT',
        value: '87d97d16b352ad651b8bcc2bdf682c969771a20e',
      },
    ],
    pipelineSpec: {
      tasks: [],
    },
    taskRuns: {
      '1-nodejs-2bwzn-show-summary': {
        pipelineTaskName: 'show-summary',
        status: {
          completionTime: '2022-08-23T19:08:18Z',
          conditions: [
            {
              lastTransitionTime: '2022-08-23T19:08:18Z',
              message:
                'failed to create task run pod "1-nodejs-2bwzn-show-summary": Pod "1-nodejs-2bwzn-show-summary-pod" is invalid: spec.activeDeadlineSeconds: Invalid value: 0: must be between 1 and 2147483647, inclusive. Maybe missing or invalid Task mfrances/summary',
              reason: 'CouldntGetTask',
              status: ' ',
              type: 'Succeeded',
            },
          ],
          podName: '',
          startTime: '2022-08-23T19:08:18Z',
          taskSpec: {
            description: 'App Studio Summary Pipeline Task.',
            params: [
              {
                description: 'pipeline-run to annotate',
                name: 'pipeline-run-name',
                type: 'string',
              },
              {
                description: 'Git URL',
                name: 'git-url',
                type: 'string',
              },
              {
                description: 'Image URL',
                name: 'image-url',
                type: 'string',
              },
            ],
            steps: [
              {
                image:
                  'registry.redhat.io/openshift4/ose-cli@sha256:e6b307c51374607294d1756b871d3c702251c396efdd44d4ef8db68e239339d3',
                name: 'appstudio-summary',
                resources: {},
                script: [
                  '#!/usr/bin/env bash\necho\necho "App Studio Build Summary:"\necho\necho "Build repository: $(params.git-url)"\necho "Generated Image is in : $(params.image-url)"\necho\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/repo=$(params.git-url)\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/image=$(params.image-url)\n\necho "Output is in the following annotations:"\n\necho "Build Repo is in \'build.appstudio.openshift.io/repo\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/repo}"\'\n\necho "Build Image is in \'build.appstudio.openshift.io/image\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/image}"\'\n\necho End Summary\n',
                ],
              },
            ],
          },
        },
      },
    },
  },
};

describe('test pipelinerun stop command', () => {
  it('stop command should exist', async () => {
    patchResourceMock.mockResolvedValue({});
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <tr>
              <PipelineRunListRow obj={pipelineRun} columns={[]} />
            </tr>
          </tbody>
        </table>
      </BrowserRouter>,
    );
    const kebabButton = screen.getByTestId('kebab-button');

    fireEvent.click(kebabButton);

    await waitFor(() => {
      const stopButton = screen.getByRole('menuitem', { name: 'Stop' });
      expect(stopButton).toBeVisible();
    });
  });

  it('stop command should update resource when clicked', async () => {
    patchResourceMock.mockResolvedValue({});
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <tr>
              <PipelineRunListRow obj={pipelineRun} columns={[]} />
            </tr>
          </tbody>
        </table>
      </BrowserRouter>,
    );
    const kebabButton = screen.getByTestId('kebab-button');

    fireEvent.click(kebabButton);

    await waitFor(() => {
      const stopButton = screen.getByRole('menuitem', { name: 'Stop' });
      fireEvent.click(stopButton);
      expect(patchResourceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          queryOptions: { name: '1-nodejs-2bwzn', ns: 'karthik-jk' },
          patches: [{ op: 'replace', path: '/spec/status', value: 'pipelineRunCancelled' }],
        }),
      );
    });
  });
});
