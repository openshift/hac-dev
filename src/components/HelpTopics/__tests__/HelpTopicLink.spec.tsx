import * as React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { EnableHelpTopicContextProvider } from '../EnableHelpTopicContext';
import { useChromeHelpTopicsApi } from '../help-topics';
import { HelpTopicLink } from '../HelpTopicLink';

jest.mock('../help-topics', () => ({
  useChromeHelpTopicsApi: jest.fn(),
}));

const useChromeMock = useChromeHelpTopicsApi as jest.Mock;

describe('HelpTopicLink', () => {
  it('should enable topic when component is mounted and disable when unmounted', () => {
    const enableTopics = jest.fn(() => Promise.resolve({}));
    const disableTopics = jest.fn();
    useChromeMock.mockReturnValue({
      setActiveTopic: jest.fn(),
      enableTopics,
      disableTopics,
    });

    render(
      <EnableHelpTopicContextProvider>
        <HelpTopicLink topicId="test" />
      </EnableHelpTopicContextProvider>,
    );
    expect(enableTopics).toHaveBeenCalledWith('test');
    cleanup();
    expect(disableTopics).toHaveBeenCalledWith('test');
  });

  it('should set active topic when button is clicked', () => {
    const setActiveTopic = jest.fn();
    useChromeMock.mockReturnValue({
      setActiveTopic,
      enableTopics: jest.fn(() => Promise.resolve({})),
      disableTopics: jest.fn(),
    });

    render(
      <EnableHelpTopicContextProvider>
        <HelpTopicLink topicId="test">Learn more</HelpTopicLink>
      </EnableHelpTopicContextProvider>,
    );
    fireEvent.click(screen.getByText('Learn more'));
    expect(setActiveTopic).toHaveBeenCalledWith('test');
  });
});
