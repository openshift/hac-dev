import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContextSelectList } from '../ContextSelectList';

const mockContexts = [
  { name: 'application', description: 'Test context application', selected: true },
  { name: 'component', description: 'Test context component', selected: true },
  { name: 'group', description: 'Test context group', selected: false },
];

describe('ContextSelectList Component', () => {
  const mockOnSelect = jest.fn();

  const openDropdown = async () => {
    const toggleButton = screen.getByTestId('context-dropdown-toggle');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await act(async () => {
      fireEvent.click(toggleButton); // Wrap state update in act
    });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  };

  const testContextOption = (name: string) => {
    expect(screen.getByTestId(`context-option-${name}`)).toBeInTheDocument();
  };

  it('renders correctly with selected contexts and chips', async () => {
    render(
      <ContextSelectList selectedContexts={mockContexts} onSelect={mockOnSelect} editing={true} />,
    );

    // Assert that the "Select Contexts" button is present and renders the selected chips
    const toggleButton = screen.getByTestId('context-dropdown-toggle');
    expect(toggleButton).toBeInTheDocument();

    // Chips should be rendered
    const chip1 = screen.getByTestId('context-chip-application');
    const chip2 = screen.getByTestId('context-chip-component');
    expect(chip1).toBeInTheDocument();
    expect(chip2).toBeInTheDocument();
    // The context option 'group' is not selected, it shouldn't have a chip.
    expect(screen.queryByTestId('context-chip-group')).not.toBeInTheDocument();

    // We should also see the passed context options listed once the dropdown is open.
    await openDropdown(); // Use act to wrap state updates
    mockContexts.forEach((ctx) => testContextOption(ctx.name));
  });

  it('calls onSelect when a chip is clicked', async () => {
    render(
      <ContextSelectList selectedContexts={mockContexts} onSelect={mockOnSelect} editing={true} />,
    );

    // Get the button element for this context chip
    const chip1 = screen.getByTestId('context-chip-application').childNodes[1].childNodes[0];
    // Click it
    await act(async () => {
      fireEvent.click(chip1); // Wrap in act to handle state changes
    });

    // Assert the mock function was called with the correct context name
    expect(mockOnSelect).toHaveBeenCalledWith(expect.anything(), 'application');
  });

  it('calls onSelect when a dropdown option is clicked', async () => {
    render(
      <ContextSelectList selectedContexts={mockContexts} onSelect={mockOnSelect} editing={true} />,
    );

    // Open the dropdown and select an unselected option
    await openDropdown(); // Wrap in act

    // Get the button element for this context option
    const option2 = screen.getByTestId('context-option-group').childNodes[0];
    // Click it
    await act(async () => {
      fireEvent.click(option2); // Wrap in act to handle state updates
    });

    // Assert the mock function was called with the correct context name
    expect(mockOnSelect).toHaveBeenCalledWith(expect.anything(), 'group');
  });
});
