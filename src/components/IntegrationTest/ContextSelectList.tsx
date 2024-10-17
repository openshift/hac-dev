import React, { useState, useCallback } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  ChipGroup,
  Chip,
} from '@patternfly/react-core';
import { ContextOption } from './ContextsField';

type ContextSelectListProps = {
  selectedContexts: ContextOption[];
  onSelect: (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    contextName: string,
  ) => void;
  editing: boolean;
};

export const ContextSelectList: React.FC<ContextSelectListProps> = ({
  selectedContexts,
  onSelect,
  editing,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleClick = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const selectedContextChips = selectedContexts.filter((ctx) => ctx.selected);

  const renderToggle = useCallback(
    (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={onToggleClick}
        isExpanded={isOpen}
        style={{ minWidth: '750px' } as React.CSSProperties}
        data-testid="context-dropdown-toggle"
      >
        {selectedContextChips.length > 0 ? (
          <ChipGroup>
            {selectedContextChips.map((ctx) => (
              <Chip
                key={ctx.name}
                onClick={(_event) => onSelect(_event, ctx.name)}
                data-testid={`context-chip-${ctx.name}`}
              >
                {ctx.name}
              </Chip>
            ))}
          </ChipGroup>
        ) : (
          'Select Contexts'
        )}
      </MenuToggle>
    ),
    [isOpen, onToggleClick, onSelect, selectedContextChips],
  );

  return (
    <Select
      role="menu"
      id="context-select"
      isOpen={isOpen}
      onSelect={(_event, value) => onSelect(_event, value as string)}
      onOpenChange={setIsOpen}
      toggle={renderToggle}
      style={{ maxWidth: '750px' }}
    >
      <SelectList>
        {selectedContexts.map((ctx) => (
          <SelectOption
            key={ctx.name}
            value={ctx.name}
            isSelected={ctx.selected}
            description={ctx.description}
            isDisabled={!editing && ctx.name === 'application'}
            data-testid={`context-option-${ctx.name}`}
          >
            {ctx.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
