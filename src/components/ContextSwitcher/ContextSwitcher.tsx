import React from 'react';
import {
  Menu,
  MenuContent,
  MenuFooter,
  MenuSearch,
  MenuList,
  Tab,
  Tabs,
  TabTitleText,
  TextInput,
  MenuSearchInput,
} from '@patternfly/react-core';
import { Dropdown, DropdownToggle } from '@patternfly/react-core/deprecated';
import EllipsisHIcon from '@patternfly/react-icons/dist/js/icons/ellipsis-h-icon';
import '././ContextSwitcher.scss';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ContextMenuListItem, getFilteredItems, findItemByKey } from './context-switcher-utils';

export const APPLICATION_SWITCHER_STORAGE_KEY = 'application-switcher';
export const WORKSPACE_SWITCHER_STORAGE_KEY = 'workspace-switcher';

type LocalStorageKeys = {
  recentItems?: { [key: string]: string[] };
  lastTab?: { [key: string]: ContextTab };
};

export const enum ContextTab {
  Recent,
  All,
  Public,
  Private,
}

export const MenuTabs = {
  Recent: { name: 'recent', displayName: 'Recent' },
  All: { name: 'all', displayName: 'All' },
  Public: { name: 'public', displayName: 'Public' },
  Private: { name: 'private', displayName: 'Private' },
};

export type ContextMenuItem = {
  key: string;
  name: string;
  visibility?: string;
  subItems?: ContextMenuItem[];
};

type ContextSwitcherProps = {
  menuItems: {
    tabKey: ContextTab;
    tabName: string;
    displayName: string;
    menuItems: ContextMenuItem[];
  }[];
  selectedItem?: ContextMenuItem;
  maxRecentItems?: number;
  showRecentItems?: boolean;
  onSelect?: (item: ContextMenuItem) => void;
  resourceType?: string;
  storageKey?: string;
  footer?: React.ReactNode;
};

export const ContextSwitcher: React.FC<React.PropsWithChildren<ContextSwitcherProps>> = ({
  menuItems,
  selectedItem,
  onSelect,
  showRecentItems = false,
  storageKey = WORKSPACE_SWITCHER_STORAGE_KEY,
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
  const [localStorage, setLocalStorage] = useLocalStorage<LocalStorageKeys>(storageKey);

  const recentItems = React.useMemo(
    () => (localStorage as LocalStorageKeys)?.recentItems || {},
    [localStorage],
  );

  const lastTab = React.useMemo(
    () => (localStorage as LocalStorageKeys)?.lastTab || {},
    [localStorage],
  );

  const allItems = menuItems.find((item) => item.tabKey === ContextTab.All)?.menuItems;

  const [activeTab, setActiveTab] = React.useState<ContextTab>(
    lastTab[resourceType] === undefined ? ContextTab.All : lastTab[resourceType],
  );

  const recentMenuItems = React.useMemo(() => {
    const recentKeys: string[] = recentItems[resourceType];
    if (!recentKeys || recentKeys.length === 0) {
      return selectedItem ? [selectedItem] : [];
    }
    return recentKeys.map((k) => findItemByKey(allItems, k)).filter((v) => !!v);
  }, [resourceType, selectedItem, recentItems, allItems]);

  const filteredMenuItems = React.useMemo(
    () =>
      showRecentItems
        ? [
            ...menuItems.map((tab) => getFilteredItems(tab.menuItems, searchText.toLowerCase())),
            getFilteredItems(recentMenuItems, searchText.toLowerCase()),
          ]
        : menuItems.map((tab) => getFilteredItems(tab.menuItems, searchText.toLowerCase())),
    [menuItems, searchText, showRecentItems, recentMenuItems],
  );

  const onItemSelect = (_: React.MouseEvent, key: string) => {
    const itemKey = key.startsWith('group:') ? key.replace('group:', '') : key;
    const item = findItemByKey(allItems, itemKey);
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

  const onDrillIn = (
    event: React.KeyboardEvent | React.MouseEvent,
    fromMenuId: string,
    toMenuId: string,
    pathId: string,
  ) => {
    setMenuDrilledIn([...menuDrilledIn, fromMenuId]);
    setDrilldownPath([...drilldownPath, pathId]);
    setActiveMenu(toMenuId);
  };

  const onDrillOut = (event: React.KeyboardEvent | React.MouseEvent, toMenuId: string) => {
    const menuDrilledInSansLast = menuDrilledIn.slice(0, menuDrilledIn.length - 1);
    const pathSansLast = drilldownPath.slice(0, drilldownPath.length - 1);
    setMenuDrilledIn(menuDrilledInSansLast);
    setDrilldownPath(pathSansLast);
    setActiveMenu(toMenuId);
  };

  const tabMenuItems = React.useMemo(
    () =>
      showRecentItems
        ? [
            ...menuItems,
            {
              tabKey: ContextTab.Recent,
              tabName: MenuTabs.Recent.name,
              displayName: MenuTabs.Recent.displayName,
            },
          ]
        : menuItems,
    [menuItems, showRecentItems],
  );

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
      className="context-switcher"
      toggle={
        <DropdownToggle
          id="toggle-context-switcher"
          className="context-switcher__dropdown"
          aria-label="toggle context switcher menu"
          onToggle={(_event, val) => setIsOpen(val)}
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
        <MenuSearch>
          <MenuSearchInput>
            <TextInput
              value={searchText}
              type="search"
              aria-label="name filter"
              placeholder={`Filter ${resourceType} by name`}
              onChange={(_event, val) => setSearchText(val)}
            />
          </MenuSearchInput>
        </MenuSearch>
        <MenuContent menuHeight={`${menuHeights[activeMenu]}px`}>
          <Tabs activeKey={activeTab} onSelect={onTabChange} isFilled>
            {filteredMenuItems.map((menuItem, i) => (
              <Tab
                eventKey={tabMenuItems[i].tabKey}
                key={tabMenuItems[i].tabName}
                title={
                  <TabTitleText data-test={`tab-${tabMenuItems[i].tabName}`}>
                    {tabMenuItems[i].displayName}
                  </TabTitleText>
                }
              >
                <MenuList>
                  {menuItem.map((item) => (
                    <ContextMenuListItem key={item.key} item={item} />
                  ))}
                </MenuList>
              </Tab>
            ))}
          </Tabs>
        </MenuContent>
        {footer && <MenuFooter>{footer}</MenuFooter>}
      </Menu>
    </Dropdown>
  );
};
