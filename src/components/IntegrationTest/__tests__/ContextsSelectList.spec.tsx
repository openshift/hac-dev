import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContextSelectList } from '../ContextSelectList';
import { ContextOption } from '../utils';

describe('ContextSelectList Component', () => {
  const defaultProps = {
    allContexts: [
      { name: 'application', description: 'Test context application', selected: true },
      { name: 'component', description: 'Test context component', selected: false },
      { name: 'group', description: 'Test context group', selected: false },
    ] as ContextOption[],
    filteredContexts: [
      { name: 'application', description: 'Test context application', selected: true },
      { name: 'component', description: 'Test context component', selected: false },
      { name: 'group', description: 'Test context group', selected: false },
    ] as ContextOption[],
    onSelect: jest.fn(),
    onInputValueChange: jest.fn(),
    inputValue: '',
    onRemoveAll: jest.fn(),
    editing: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const openDropdown = async () => {
    const toggleButton = screen.getByTestId('context-dropdown-toggle').childNodes[1];
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  };

  const getContextOption = (name: string) => {
    return screen.getByTestId(`context-option-${name}`);
  };

  const getContextOptionButton = (name: string) => {
    return screen.getByTestId(`context-option-${name}`).childNodes[0];
  };

  const getChip = (name: string) => {
    return screen.getByTestId(`context-chip-${name}`);
  };

  const getChipButton = (name: string) => {
    return screen.getByTestId(`context-chip-${name}`).childNodes[1].childNodes[0];
  };

  it('renders correctly', () => {
    render(<ContextSelectList {...defaultProps} />);
    expect(screen.getByPlaceholderText('Select a context')).toBeInTheDocument();
    expect(screen.getByTestId('context-dropdown-toggle')).toBeInTheDocument();
  });

  it('displays selected contexts as chips', () => {
    render(<ContextSelectList {...defaultProps} />);
    const appChip = getChip('application');
    expect(appChip).toBeInTheDocument();
    expect(appChip).toHaveTextContent('application');
    // If the context was not previously selected and saved,
    // it should not have a chip.
    expect(screen.queryByTestId('context-chip-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('context-chip-group')).not.toBeInTheDocument();
  });

  it('calls onSelect when a chip is clicked', async () => {
    render(<ContextSelectList {...defaultProps} />);
    const appChip = getChipButton('application');
    await act(async () => {
      fireEvent.click(appChip);
    });
    expect(defaultProps.onSelect).toHaveBeenCalledWith('application');
  });

  it('updates input value on typing', async () => {
    render(<ContextSelectList {...defaultProps} />);
    const input = screen.getByPlaceholderText('Select a context');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'new context' } });
    });
    expect(defaultProps.onInputValueChange).toHaveBeenCalledWith('new context');
  });

  it('opens the dropdown when clicking the toggle', async () => {
    render(<ContextSelectList {...defaultProps} />);
    await openDropdown();
    expect(getContextOption('application')).toBeInTheDocument();
  });

  it('calls onSelect when a context option is clicked', async () => {
    render(<ContextSelectList {...defaultProps} />);
    await openDropdown();
    const groupOption = getContextOptionButton('group');
    await act(async () => {
      fireEvent.click(groupOption);
    });
    expect(defaultProps.onSelect).toHaveBeenCalledWith('group');
  });

  it('calls onRemoveAll when clear button is clicked', async () => {
    render(<ContextSelectList {...defaultProps} />);
    const clearButton = screen.getByTestId('clear-button');
    await act(async () => fireEvent.click(clearButton));
    expect(defaultProps.onRemoveAll).toHaveBeenCalled();
  });

  it('closes the dropdown on selecting an item', async () => {
    render(<ContextSelectList {...defaultProps} />);
    await openDropdown();
    const componentOption = getContextOptionButton('component');
    await act(async () => fireEvent.click(componentOption));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('component');
  });

  it('should focus on the next item when ArrowDown is pressed', async () => {
    render(<ContextSelectList {...defaultProps} />);
    const input = screen.getByTestId('multi-typeahead-select-input');
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });
    // We should expect the focus class to have been appended to this context option
    expect(getContextOption('application')).toHaveClass('pf-m-focus');
    // All other values should not be in focus
    defaultProps.filteredContexts
      .filter((ctx) => ctx.name !== 'application')
      .forEach((ctx) => {
        expect(getContextOption(ctx.name)).not.toHaveClass('pf-m-focus');
      });
  });

  it('should focus on the previous item when ArrowUp is pressed', async () => {
    render(<ContextSelectList {...defaultProps} />);
    const input = screen.getByTestId('multi-typeahead-select-input');
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });
    // Since we're going up the list, the last value should be focused.
    expect(getContextOption('group')).toHaveClass('pf-m-focus');
    // All other values should not be in focus
    defaultProps.filteredContexts
      .filter((ctx) => ctx.name !== 'group')
      .forEach((ctx) => {
        expect(getContextOption(ctx.name)).not.toHaveClass('pf-m-focus');
      });
  });
});
