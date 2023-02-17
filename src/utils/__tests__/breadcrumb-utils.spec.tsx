import * as React from 'react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import { renderHook } from '@testing-library/react-hooks';
import { useApplicationBreadcrumbs } from '../breadcrumb-utils';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useParams: jest.fn(),
}));

const useParamsMock = useParams as jest.Mock;

describe('useApplicationBreadcrumbs', () => {
  it('should contain till not return application name link if the application name is not passed', () => {
    useParamsMock.mockReturnValue({});
    const { result } = renderHook(() => useApplicationBreadcrumbs());
    expect(result.current).toHaveLength(6);
  });

  it('should contain application name link when application name is passed', () => {
    useParamsMock.mockReturnValue({ appName: 'test-app' });
    const { result } = renderHook(() => useApplicationBreadcrumbs());
    expect(result.current).toHaveLength(8);
  });
});
