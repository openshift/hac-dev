import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  Menu,
  MenuContent,
  MenuFooter,
  MenuInput,
  MenuList,
  Tab,
  Tabs,
  TabTitleText,
  TextInput,
} from '@patternfly/react-core';
import EllipsisHIcon from '@patternfly/react-icons/dist/js/icons/ellipsis-h-icon';
import '././ContextSwitcher.scss';
import { useLocalStorage } from '../../hooks';
import { ContextMenuListItem, filteredItems, findItemByKey } from './context-switcher-utils';

const LOCAL_STORAGE_KEY = 'context-switcher';

type LocalStorageKeys = {
  recentItems?: { [key: string]: string[] };
  lastTab?: { [key: string]: ContextTab };
};

const enum ContextTab {
  Recent,
  All,
}

export type ContextMenuItem = {
  key: string;
  name: string;
  subItems?: ContextMenuItem[];
};

type ContextSwitcherProps = {
  menuItems: ContextMenuItem[];
  selectedItem?: ContextMenuItem;
  maxRecentItems?: number;
  onSelect?: (item: ContextMenuItem) => void;
  resourceType?: string;
  footer?: React.ReactNode;
};

export const ContextSwitcher: React.FC<ContextSwitcherProps> = ({
  menuItems,
  selectedItem,
  onSelect,
  resourceType = 'resource',
  maxRecentItems = 5,
  footer,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [menuDrilledIn, setMenuDrilledIn] = React.useState<string[]>([]);
  const [drilldownPath, setDrilldownPath] = React.useState<string[]>([]);
  const [menuHeights, setMenuHeights] = React.useState<{ [key: string]: number }>({});
  const [activeMenu, setActiveMenu] = React.useState<string>('context-switcher-root-menu');
  const [localStorage, setLocalStorage] = useLocalStorage<LocalStorageKeys>(LOCAL_STORAGE_KEY);

  const recentItems = React.useMemo(
    () => (localStorage as LocalStorageKeys)?.recentItems || {},
    [localStorage],
  );

  const lastTab = React.useMemo(
    () => (localStorage as LocalStorageKeys)?.lastTab || {},
    [localStorage],
  );

  const [activeTab, setActiveTab] = React.useState<ContextTab>(
    lastTab[resourceType] === undefined ? ContextTab.All : lastTab[resourceType],
  );

  const recentMenuItems = React.useMemo(() => {
    const recentKeys: string[] = recentItems[resourceType];
    if (!recentKeys || recentKeys.length === 0) {
      return selectedItem ? [selectedItem] : [];
    }
    return recentKeys.map((k) => findItemByKey(menuItems, k)).filter((v) => !!v);
  }, [menuItems, resourceType, selectedItem, recentItems]);

  const [filteredRecentItems, filteredAllItems] = React.useMemo(
    () => [
      filteredItems(recentMenuItems, searchText.toLowerCase()),
      filteredItems(menuItems, searchText.toLowerCase()),
    ],
    [menuItems, recentMenuItems, searchText],
  );

  const onItemSelect = (_: React.MouseEvent, key: string) => {
    const itemKey = key.startsWith('group:') ? key.replace('group:', '') : key;
    const item = findItemByKey(menuItems, itemKey);
    if (item.subItems?.length === 0) {
      return;
    }
    const recentKeys = (recentItems[resourceType] as string[]) || [];
    if (!recentKeys.includes(key)) {
      setLocalStorage({
        ...((localStorage as LocalStorageKeys) || {}),
        recentItems: {
          ...recentItems,
          [resourceType]: [key, ...recentKeys.slice(0, maxRecentItems - 1)],
        },
      });
    }
    setIsOpen(false);
    onSelect?.(item);
  };

  const onTabChange = (_: React.MouseEvent, key: number) => {
    setLocalStorage({
      ...((localStorage as LocalStorageKeys) || {}),
      lastTab: { ...lastTab, [resourceType]: key },
    });
    setActiveTab(key);
    setMenuDrilledIn([]);
    setDrilldownPath([]);
    setMenuHeights({});
    setActiveMenu('context-switcher-root-menu');
  };

  const onDrillIn = (fromMenuId: string, toMenuId: string, pathId: string) => {
    setMenuDrilledIn([...menuDrilledIn, fromMenuId]);
    setDrilldownPath([...drilldownPath, pathId]);
    setActiveMenu(toMenuId);
  };

  const onDrillOut = (toMenuId: string) => {
    const menuDrilledInSansLast = menuDrilledIn.slice(0, menuDrilledIn.length - 1);
    const pathSansLast = drilldownPath.slice(0, drilldownPath.length - 1);
    setMenuDrilledIn(menuDrilledInSansLast);
    setDrilldownPath(pathSansLast);
    setActiveMenu(toMenuId);
  };

  const setHeight = (menuId: string, height: number) => {
    if (
      menuHeights[menuId] === undefined ||
      (menuId !== 'context-switcher-root-menu' && menuHeights[menuId] !== height)
    ) {
      setMenuHeights({ ...menuHeights, [menuId]: height });
    }
  };

  return (
    <Dropdown
      toggle={
        <DropdownToggle
          id="toggle-context-switcher"
          className="context-switcher__dropdown"
          aria-label="toggle context switcher menu"
          onToggle={setIsOpen}
          toggleIndicator={null}
          isPlain
        >
          <EllipsisHIcon />
        </DropdownToggle>
      }
      isOpen={isOpen}
      isPlain
    >
      <Menu
        id="context-switcher-root-menu"
        className="context-switcher__menu"
        selected={selectedItem?.key}
        onSelect={onItemSelect}
        drilldownItemPath={drilldownPath}
        drilledInMenus={menuDrilledIn}
        activeMenu={activeMenu}
        onDrillIn={onDrillIn}
        onDrillOut={onDrillOut}
        onGetMenuHeight={setHeight}
        containsDrilldown
        isScrollable
        isPlain
      >
        <MenuInput>
          <TextInput
            value={searchText}
            type="search"
            iconVariant="search"
            aria-label="name filter"
            placeholder={`Filter ${resourceType} by name`}
            onChange={setSearchText}
          />
        </MenuInput>
        <MenuContent menuHeight={`${menuHeights[activeMenu]}px`}>
          <Tabs activeKey={activeTab} onSelect={onTabChange} isFilled>
            <Tab eventKey={ContextTab.Recent} title={<TabTitleText>Recent</TabTitleText>}>
              <MenuList>
                {filteredRecentItems.map((item) => (
                  <ContextMenuListItem key={item.key} item={item} />
                ))}
              </MenuList>
            </Tab>
            <Tab eventKey={ContextTab.All} title={<TabTitleText>All</TabTitleText>}>
              <MenuList>
                {filteredAllItems.map((item) => (
                  <ContextMenuListItem key={item.key} item={item} />
                ))}
              </MenuList>
            </Tab>
          </Tabs>
        </MenuContent>
        {footer && <MenuFooter>{footer}</MenuFooter>}
      </Menu>
    </Dropdown>
  );
};
