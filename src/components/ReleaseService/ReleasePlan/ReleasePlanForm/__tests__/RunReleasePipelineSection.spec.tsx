import React from 'react';
import '@testing-library/jest-dom';
import { formikRenderer } from '../../../../../utils/test-utils';
import { ReleasePipelineLocation } from '../form-utils';
import { RunReleasePipelineSection } from '../RunReleasePipelineSection';

jest.mock('../../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ workspace: 'test-ws' })),
}));

jest.mock('../../../../../hooks/useApplications', () => ({
  useApplications: jest.fn(() => [[], true]),
}));

jest.mock('../../../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
}));

describe('RunReleasePipelineSection', () => {
  it('should not show target fields if location is not selected', () => {
    const values = {};
    const result = formikRenderer(<RunReleasePipelineSection />, values);
    expect(result.queryByRole('button', { name: 'Git options' })).toBeNull();
    expect(result.queryByRole('textbox', { name: 'GitHub URL' })).toBeNull();
    expect(result.queryByRole('textbox', { name: 'Revision' })).toBeNull();
    expect(result.queryByRole('textbox', { name: 'Path in repository' })).toBeNull();
    expect(result.queryByRole('region', { name: 'Git options' })).toBeNull();
    expect(result.queryByRole('textbox', { name: 'Service account' })).toBeNull();
  });

  it('should show current ws fields if current location is selected', () => {
    const values = { releasePipelineLocation: ReleasePipelineLocation.current };
    const result = formikRenderer(<RunReleasePipelineSection />, values);
    expect(result.getByRole('button', { name: 'Git options' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'GitHub URL' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Revision' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Path in repository' })).toBeVisible();
    expect(result.getByRole('region', { name: 'Git options' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Service account' })).toBeVisible();
  });

  it('should show target select fields if target location is selected', () => {
    const values = { releasePipelineLocation: ReleasePipelineLocation.target };
    const result = formikRenderer(<RunReleasePipelineSection />, values);
    expect(result.getByRole('button', { name: 'Git options' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'GitHub URL' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Revision' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Path in repository' })).toBeVisible();
    expect(result.getByRole('region', { name: 'Git options' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Target workspace' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Data' })).toBeVisible();
  });
});
