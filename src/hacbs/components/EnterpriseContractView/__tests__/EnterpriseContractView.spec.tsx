import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { act, configure, fireEvent, render, screen } from '@testing-library/react';
import { mockLocation } from '../../../../utils/test-utils';
import { MockECPolicy } from '../__data__/mockECPolicy';
import { MockEnterpriseContractPolicies } from '../__data__/mockEnterpriseContractPolicies';
import EnterpriseContractView from '../EnterpriseContractView';
import { useEnterpriseContractPolicies } from '../useEnterpriseContractPolicies';

mockLocation();

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));
const watchResourceMock = useK8sWatchResource as jest.Mock;

jest.mock('../../EnterpriseContractView/useEnterpriseContractPolicies', () => ({
  useEnterpriseContractPolicies: jest.fn(),
}));
const useEnterpriseContractPoliciesMock = useEnterpriseContractPolicies as jest.Mock;

configure({ testIdAttribute: 'data-testid' });

describe('EnterpriseContractView', () => {
  beforeEach(() => {
    useEnterpriseContractPoliciesMock.mockImplementation(() => MockEnterpriseContractPolicies);
  });
  it('should render the release policy section', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<EnterpriseContractView />);
    expect(screen.getByTestId('enterprise-contract-package-list')).toBeInTheDocument();
  });
  it('should show the release package items', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<EnterpriseContractView />);
    expect(
      screen
        .getByTestId('enterprise-contract-package-list')
        .querySelectorAll('.release-policy-item').length,
    ).toBe(Object.keys(MockEnterpriseContractPolicies.releasePackages).length);
  });
  it('should show the release annotations when a package is expanded', () => {
    watchResourceMock.mockReturnValue([[], true]);
    act(() => {
      render(<EnterpriseContractView />);
    });

    const testPackageKey = Object.keys(MockEnterpriseContractPolicies.releasePackages)[1];
    const testPackageItem = MockEnterpriseContractPolicies.releasePackages[testPackageKey];
    const testAnnotations = MockEnterpriseContractPolicies.releaseAnnotations[testPackageKey];

    const packageItem = screen.getByTestId(`release-package-item-${testPackageItem.shortName}`);
    expect(
      packageItem.querySelectorAll('.release-policy-item__package-annotation-link').length,
    ).toBe(testAnnotations.length);

    let annotation = screen.getByText(testAnnotations[0].title);
    expect(annotation).not.toBeVisible();

    const packageItemToggle = screen.getByTestId(`${testPackageItem.shortName}-toggle`);
    expect(packageItemToggle).toBeVisible();
    fireEvent.click(packageItemToggle);

    annotation = screen.getByText(testAnnotations[0].title);
    expect(annotation).toBeVisible();
  });
  it('should a link to the github repository when available', () => {
    watchResourceMock.mockReturnValue([MockECPolicy, true]);
    act(() => {
      render(<EnterpriseContractView />);
    });
    const linkContainer = screen.getByTestId('enterprise-contract-github-link');
    expect(linkContainer).toBeVisible();
    expect(linkContainer.querySelector('a').href).toBe(MockECPolicy.sources.git.repository);
  });
});
