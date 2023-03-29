import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActionMenuItem, { ActionMenuItemProps } from '../ActionMenuItem';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const useNavigateMock = useNavigate as jest.Mock;

const ActionMenuItemRenderer = (props: ActionMenuItemProps) =>
  render(<ActionMenuItem {...props} />);

describe('ActionMenuItem', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the action', async () => {
    ActionMenuItemRenderer({
      action: {
        cta: () => {},
        id: 'action-1',
        label: 'Action 1',
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId('Action 1').textContent).toBe('Action 1');
    });
  });

  it('should use custom component', async () => {
    ActionMenuItemRenderer({
      action: {
        cta: () => {},
        id: 'action-1',
        label: 'Action 1',
      },
      component: () => <a data-testid="custom-component">Custom Action</a>,
    });
    await waitFor(() => {
      expect(screen.getByTestId('custom-component').textContent).toBe('Custom Action');
    });
  });

  it('should show tooltip on hover', async () => {
    ActionMenuItemRenderer({
      action: {
        cta: () => {},
        id: 'action-1',
        label: 'Action 1',
        tooltip: 'Test tooltip description',
      },
    });

    fireEvent.mouseEnter(screen.getByTestId('Action 1'));

    await waitFor(() => {
      screen.getByText('Test tooltip description');
    });
  });

  it('should call the cta function', async () => {
    const handleCta = jest.fn();
    const { getByTestId } = ActionMenuItemRenderer({
      action: {
        cta: handleCta,
        id: 'action-1',
        label: 'Action 1',
      },
    });

    fireEvent.click(within(getByTestId('Action 1')).getByRole('button'));

    await waitFor(() => {
      expect(handleCta).toHaveBeenCalledTimes(1);
    });
  });

  it('should use href from the cta', async () => {
    const { getByTestId } = ActionMenuItemRenderer({
      action: {
        cta: {
          href: 'www.example.com',
        },
        id: 'action-1',
        label: 'Action 1',
      },
    });

    fireEvent.click(within(getByTestId('Action 1')).getByRole('button'));

    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should render an external link', async () => {
    const { getByTestId } = ActionMenuItemRenderer({
      action: {
        cta: {
          href: 'www.example.com',
          external: true,
        },
        id: 'action-1',
        label: 'Action 1',
      },
    });

    fireEvent.click(within(getByTestId('Action 1')).getByRole('menuitem'));

    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should navigate to the link when enter is pressed ', async () => {
    const { getByTestId } = ActionMenuItemRenderer({
      action: {
        cta: {
          href: 'www.example.com',
        },
        id: 'action-1',
        label: 'Action 1',
      },
    });

    fireEvent.keyDown(within(getByTestId('Action 1')).getByRole('button'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });

    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onEscape function when escape key is pressed ', async () => {
    const onEscapeHandler = jest.fn();
    const { getByTestId } = ActionMenuItemRenderer({
      action: {
        cta: () => {},
        id: 'action-1',
        label: 'Action 1',
      },
      onEscape: onEscapeHandler,
    });

    fireEvent.keyDown(within(getByTestId('Action 1')).getByRole('button'), {
      key: 'ESCAPE',
      keyCode: 27,
    });

    await waitFor(() => {
      expect(onEscapeHandler).toHaveBeenCalledTimes(1);
    });
  });

  it('should call custom onClick handler', async () => {
    const onClickHandler = jest.fn();
    const { getByTestId } = ActionMenuItemRenderer({
      action: {
        cta: () => {},
        id: 'action-1',
        label: 'Action 1',
      },
      onClick: onClickHandler,
    });

    fireEvent.click(within(getByTestId('Action 1')).getByRole('button'));

    await waitFor(() => {
      expect(onClickHandler).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call the cta when the action is disabled', async () => {
    const handleCta = jest.fn();
    const { getByTestId } = ActionMenuItemRenderer({
      action: {
        cta: handleCta,
        id: 'action-1',
        label: 'Action 1',
        disabled: true,
      },
    });

    fireEvent.click(within(getByTestId('Action 1')).getByRole('button'));

    await waitFor(() => {
      expect(handleCta).not.toHaveBeenCalled();
    });
  });
});
