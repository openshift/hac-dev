import { cleanup, renderHook } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useQuickstartCloseOnUnmount } from '../useQuickstartCloseOnUnmount';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));

const useChromeMock = useChrome as jest.Mock;

describe('useQuickstartCloseOnUnmount', () => {
  it('should close help topic when component is unmounted', () => {
    const closeHelpTopic = jest.fn();
    useChromeMock.mockReturnValue({
      helpTopics: { closeHelpTopic },
    });

    renderHook(() => useQuickstartCloseOnUnmount());
    cleanup();
    expect(closeHelpTopic).toHaveBeenCalled();
  });
});
