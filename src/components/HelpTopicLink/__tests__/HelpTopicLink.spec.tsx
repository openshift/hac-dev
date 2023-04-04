import * as React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { HelpTopicLink } from '../HelpTopicLink';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));

const useChromeMock = useChrome as jest.Mock;

describe('HelpTopicLink', () => {
  it('should enable topic when component is mounted and disable when unmounted', () => {
    const enableTopics = jest.fn();
    const disableTopics = jest.fn();
    useChromeMock.mockReturnValue({
      helpTopics: { setActiveTopic: jest.fn(), enableTopics, disableTopics },
    });

    render(<HelpTopicLink topicId="test" />);
    expect(enableTopics).toHaveBeenCalledWith({ names: ['test'], append: true });
    cleanup();
    expect(disableTopics).toHaveBeenCalledWith('test');
  });

  it('should set active topic when button is clicked', () => {
    const setActiveTopic = jest.fn();
    useChromeMock.mockReturnValue({
      helpTopics: { setActiveTopic, enableTopics: jest.fn(), disableTopics: jest.fn() },
    });

    render(<HelpTopicLink topicId="test">Learn more</HelpTopicLink>);
    fireEvent.click(screen.getByText('Learn more'));
    expect(setActiveTopic).toHaveBeenCalledWith('test');
  });
});
