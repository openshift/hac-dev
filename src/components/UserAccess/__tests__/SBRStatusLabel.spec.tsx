import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import { SpaceBindingRequest } from '../../../types';
import { SBRStatusLabel } from '../SBRStatusLabel';

describe('SBRStatusLabel', () => {
  it('should not render label if status is not available', () => {
    const sbr: SpaceBindingRequest = {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'SpaceBindingRequest',
      metadata: {
        name: 'test-sbr',
      },
      spec: {
        masterUserRecord: 'user',
        spaceRole: 'contributor',
      },
    };

    render(<SBRStatusLabel sbr={sbr} />);
    expect(screen.getByText('-')).toBeVisible();
  });

  it('should render green label for provisioned sbr', () => {
    const sbr: SpaceBindingRequest = {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'SpaceBindingRequest',
      metadata: {
        name: 'test-sbr',
      },
      spec: {
        masterUserRecord: 'user',
        spaceRole: 'contributor',
      },
      status: {
        conditions: [
          {
            reason: 'Provisioned',
            status: 'True',
          },
        ],
      },
    };

    render(<SBRStatusLabel sbr={sbr} />);
    expect(screen.getByText('Provisioned')).toBeVisible();
    expect(screen.getByText('Provisioned').parentElement.parentElement).toHaveClass('pf-m-green');
  });

  it('should render gold label for non-provisioned sbr', () => {
    const sbr: SpaceBindingRequest = {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'SpaceBindingRequest',
      metadata: {
        name: 'test-sbr',
      },
      spec: {
        masterUserRecord: 'user',
        spaceRole: 'contributor',
      },
      status: {
        conditions: [
          {
            reason: 'UnknownError',
            status: 'False',
          },
        ],
      },
    };

    render(<SBRStatusLabel sbr={sbr} />);
    expect(screen.getByText('UnknownError')).toBeVisible();
    expect(screen.getByText('UnknownError').parentElement.parentElement).toHaveClass('pf-m-gold');
  });
});
