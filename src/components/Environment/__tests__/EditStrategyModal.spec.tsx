import * as React from 'react';
import '@testing-library/jest-dom';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { act, render, screen } from '@testing-library/react';
import { EnvironmentKind } from '../../../types';
import { EditStrategyModal } from '../EditStrategyModal';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  k8sPatchResource: jest.fn(),
}));

const patchResourceMock = k8sPatchResource as jest.Mock;

const devEnv: EnvironmentKind = {
  kind: 'Environment',
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  metadata: {
    name: 'dev',
    namespace: 'test',
  },
  spec: {
    displayName: 'Dev',
    deploymentStrategy: 'AppStudioAutomated',
    type: 'poc',
  },
};

const prodEnv: EnvironmentKind = {
  kind: 'Environment',
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  metadata: {
    name: 'prod',
    namespace: 'test',
  },
  spec: {
    displayName: 'Prod',
    deploymentStrategy: 'Manual',
    type: 'poc',
  },
};

describe('EditStrategyModal', () => {
  it('should enable button if strategy is selected', async () => {
    const { rerender } = render(<EditStrategyModal obj={devEnv} />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    screen.getByRole('button', { name: 'Automatic' }).click();
    screen.getByRole('menuitem', { name: 'Manual' }).click();
    expect(button).toBeEnabled();

    rerender(<EditStrategyModal obj={prodEnv} />);
    expect(button).toBeDisabled();
    screen.getByRole('button', { name: 'Manual' }).click();
    screen.getByRole('menuitem', { name: 'Automatic' }).click();
    expect(button).toBeDisabled();
    await act(async () => screen.getByRole('checkbox').click());
    expect(button).toBeEnabled();
  });

  it('updates resource when submitted', async () => {
    patchResourceMock.mockResolvedValue({});
    render(<EditStrategyModal obj={devEnv} onClose={() => {}} />);
    screen.getByRole('button', { name: 'Automatic' }).click();
    screen.getByRole('menuitem', { name: 'Manual' }).click();
    await act(async () => screen.getByRole('button', { name: 'Save' }).click());
    expect(patchResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryOptions: { name: 'dev', ns: 'test' },
        patches: [{ op: 'replace', path: '/spec/deploymentStrategy', value: 'Manual' }],
      }),
    );
  });
});
