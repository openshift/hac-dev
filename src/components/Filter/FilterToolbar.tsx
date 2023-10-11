import * as React from 'react';
import {
  capitalize,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/js/icons';

type Props = {
  value: string;
  dropdownItems: string[];
  onInput: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
};

export const FilterToolbar: React.FC<Props> = ({
  value,
  onInput,
  onFilterTypeChange,
  dropdownItems,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState(dropdownItems[0]);

  return (
    <Toolbar data-testid="filter-toolbar" usePageInsets>
      <ToolbarContent className="pf-v5-u-pl-0">
        <ToolbarGroup align={{ default: 'alignLeft' }}>
          <ToolbarItem>
            <InputGroup>
              <InputGroupItem>
                <Select
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      icon={<FilterIcon />}
                      isExpanded={isOpen}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {capitalize(filterType)}
                    </MenuToggle>
                  )}
                  onSelect={(_, val) => {
                    setFilterType(val as string);
                    onFilterTypeChange(val as string);
                    setIsOpen(false);
                  }}
                  selected={filterType}
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                >
                  <SelectList>
                    {dropdownItems.map((ft) => (
                      <SelectOption key={ft} value={ft}>
                        {capitalize(ft)}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </InputGroupItem>
              <InputGroupItem isFill>
                <SearchInput
                  data-test={`${filterType}-input-filter`}
                  aria-label={`${filterType} filter`}
                  placeholder={`Filter by ${filterType}...`}
                  onChange={(_, val) => {
                    onInput(val);
                  }}
                  onClear={() => onInput('')}
                  value={value}
                />
              </InputGroupItem>
            </InputGroup>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};
