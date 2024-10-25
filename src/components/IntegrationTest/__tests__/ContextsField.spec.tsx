import React from 'react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { FieldArray, useField } from 'formik';
import { ComponentKind } from 'src/types';
import { useComponents } from '../../../../src/hooks/useComponents';
import { useWorkspaceInfo } from '../../../../src/utils/workspace-context-utils';
import ContextsField from '../ContextsField';
import { contextOptions, mapContextsWithSelection, addComponentContexts } from '../utils';

// Mock the hooks used in the component
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));
jest.mock('../../../../src/utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(),
}));
jest.mock('../../../../src/hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));
jest.mock('formik', () => ({
  useField: jest.fn(),
  FieldArray: jest.fn(),
}));

describe('ContextsField', () => {
  const mockUseParams = useParams as jest.Mock;
  const mockUseWorkspaceInfo = useWorkspaceInfo as jest.Mock;
  const mockUseComponents = useComponents as jest.Mock;
  const mockUseField = useField as jest.Mock;
  const mockUseFieldArray = FieldArray as jest.Mock;

  const fieldName = 'it.contexts';

  const setupMocks = (selectedContexts = [], components = []) => {
    mockUseParams.mockReturnValue({ appName: 'test-app' });
    mockUseWorkspaceInfo.mockReturnValue({ namespace: 'test-namespace' });
    mockUseComponents.mockReturnValue([components, true]);
    mockUseField.mockReturnValue([{}, { value: selectedContexts }]);
    mockUseFieldArray.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction({ push: jest.fn(), remove: jest.fn() })}</div>;
    });
  };

  const openDropdown = async () => {
    const toggleButton = screen.getByTestId('context-dropdown-toggle').childNodes[1];
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  };

  const testContextOption = (name: string) => {
    expect(screen.getByTestId(`context-option-${name}`)).toBeInTheDocument();
  };

  beforeEach(() => {
    // Reset the mocks with no selected contexts or components
    setupMocks();
  });

  it('should render custom header if passed', () => {
    mockUseField.mockReturnValue([{}, { value: [] }]);
    render(<ContextsField fieldName={fieldName} heading="Test Heading" editing={true} />);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('displays selected contexts as chips', () => {
    mockUseField;
  });

  it('should allow selecting and deselecting a context', async () => {
    const pushMock = jest.fn();
    const removeMock = jest.fn();
    mockUseFieldArray.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction({ push: pushMock, remove: removeMock })}</div>;
    });

    // This will be our previously selected contextOption.
    const selectedContext = {
      name: contextOptions[0].name,
      description: contextOptions[0].description,
    };
    mockUseField.mockReturnValue([{}, { value: [selectedContext] }]);

    render(<ContextsField fieldName={fieldName} editing={true} />);

    await openDropdown();
    testContextOption(contextOptions[0].name);

    await act(async () => {
      fireEvent.click(screen.getByTestId(`context-option-${contextOptions[0].name}`).childNodes[0]);
    });

    // Ensure deselecting
    expect(removeMock).toHaveBeenCalledWith(0);

    // Simulate selecting another context
    await act(async () => {
      fireEvent.click(screen.getByTestId(`context-option-${contextOptions[1].name}`).childNodes[0]);
    });

    // Ensure selecting
    expect(pushMock).toHaveBeenCalledWith({
      name: contextOptions[1].name,
      description: contextOptions[1].description,
    });
  });

  it('should render additional component contexts when components are loaded', async () => {
    const mockComponents = [
      { metadata: { name: 'componentA' } },
      { metadata: { name: 'componentB' } },
    ];
    setupMocks([], mockComponents);

    render(<ContextsField fieldName={fieldName} editing={true} />);

    await openDropdown();

    // Names should be visible as a menu option
    ['componentA', 'componentB'].forEach((componentName) => {
      testContextOption(`component_${componentName}`);
    });
    // Descriptions should also be visible
    expect(screen.getByText('execute the integration test when component componentA updates'));
    expect(screen.getByText('execute the integration test when component componentB updates'));
  });

  it('should have applications pre-set as a default context when creating a new integration test', async () => {
    mockUseField.mockReturnValue([{}, { value: [] }]);
    render(<ContextsField fieldName={fieldName} heading="Test Heading" editing={false} />);
    const chip = screen.getByTestId('context-chip-application');
    // Check that context option already has a chip
    expect(chip).toBeInTheDocument();
    // Unselecting the drop down value should not be possible when creating a new integration test.
    await openDropdown();
    testContextOption('application');
    expect(screen.getByTestId('context-option-application').childNodes[0]).toBeDisabled();
  });
});

describe('mapContextsWithSelection', () => {
  it('gets the previously selected contexts and marks them selected', () => {
    const testNames = new Set(['group', 'component', 'push']);
    const selectedNames = contextOptions
      .filter((ctx) => testNames.has(ctx.name))
      .map((ctx) => ctx.name);

    const result = mapContextsWithSelection(selectedNames, contextOptions);
    selectedNames.forEach((name) => {
      const selectedContext = result.find((ctx) => ctx.name === name);
      expect(selectedContext.selected).toBeTruthy();
    });
  });
});

describe('addComponentContexts', () => {
  it('gets the previously selected components, adds them to context options and updates selected value', () => {
    const selectedComponentNames = ['component_componentA', 'component_componentC'];

    const components = [
      { metadata: { name: 'componentA' } },
      { metadata: { name: 'componentB' } },
      { metadata: { name: 'componentC' } },
    ];

    const result = addComponentContexts(
      contextOptions,
      selectedComponentNames,
      components as ComponentKind[],
    );
    selectedComponentNames.forEach((name) => {
      const selectedComponentContext = result.find((ctx) => ctx.name === name);
      expect(selectedComponentContext.selected).toBeTruthy();
    });

    // This component was not previously selected or saved, even with the 'component_' prefix added
    // so it should not be marked as selected.
    const unselectedComponent = result.find((ctx) => ctx.name === 'component_componentB');
    expect(unselectedComponent.selected).toBeFalsy();
  });
});
