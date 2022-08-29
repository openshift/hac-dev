import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EnvironmentModel } from '../../../../models';
import { EnvironmentKind } from '../../../../types';
import EnvironmentCard from '../EnvironmentCard';

const testEnv: EnvironmentKind = {
  apiVersion: `${EnvironmentModel.apiGroup}/${EnvironmentModel.apiVersion}`,
  kind: EnvironmentModel.kind,
  metadata: {
    name: 'test',
  },
  spec: {
    displayName: 'My Env',
    type: 'poc',
    deploymentStrategy: 'Manual',
    tags: ['ephemeral'],
  },
};

describe('', () => {
  it('should render environment card', () => {
    render(<EnvironmentCard environment={testEnv} />);
    expect(screen.getByText('Ephemeral')).toBeVisible();
    expect(screen.getByText(testEnv.spec.displayName)).toBeVisible();
    expect(screen.queryByText(testEnv.metadata.name)).toBeNull();
    expect(screen.getByText('Manual')).toBeVisible();
  });

  it('should render environment metadata.name when displayName is absent', () => {
    const env = {
      ...testEnv,
      spec: {
        ...testEnv.spec,
        displayName: undefined,
      },
    };
    render(<EnvironmentCard environment={env} />);
    expect(screen.getByText(testEnv.metadata.name)).toBeVisible();
    expect(screen.queryByText(testEnv.spec.displayName)).toBeNull();
  });
});
EnvironmentCard;
