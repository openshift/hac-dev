import * as React from 'react';
import '@testing-library/jest-dom';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EnvironmentKind } from '../../../types';
import { EditStrategyModal } from '../EditStrategyModal';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    k8sPatchResource: jest.fn(),
  };
});

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
    await userEvent.click(screen.getByRole('button', { name: 'Automatic' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Manual' }));
    expect(button).toBeEnabled();

    rerender(<EditStrategyModal obj={prodEnv} />);
    expect(button).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Manual' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Automatic' }));
    expect(button).toBeDisabled();
    await userEvent.click(screen.getByRole('checkbox'));
    expect(button).toBeEnabled();
  });

  it('updates resource when submitted', async () => {
    patchResourceMock.mockResolvedValue({});
    render(<EditStrategyModal obj={devEnv} onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Automatic' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Manual' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(patchResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryOptions: { name: 'dev', ns: 'test' },
        patches: [{ op: 'replace', path: '/spec/deploymentStrategy', value: 'Manual' }],
      }),
    );
  });
});
