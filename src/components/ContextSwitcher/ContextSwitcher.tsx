import React from 'react';
import { Link } from 'react-router-dom';
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
  Flex,
  FlexItem,
  Button,
} from '@patternfly/react-core';
import { Dropdown, DropdownToggle } from '@patternfly/react-core/deprecated';
import EllipsisHIcon from '@patternfly/react-icons/dist/js/icons/ellipsis-h-icon';
import '././ContextSwitcher.scss';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  ContextMenuListItem,
  filteredItems,
  findItemByKey,
  ItemVisibility,
} from './context-switcher-utils';

const LOCAL_STORAGE_KEY = 'context-switcher';

type LocalStorageKeys = {
  recentItems?: { [key: string]: string[] };
  lastTab?: { [key: string]: ContextTab };
};

const enum ContextTab {
  Recent,
  All,
  Private,
  Community,
}

export type ContextMenuItem = {
  key: string;
  name: string;
  visibility?: string;
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

export const ContextSwitcher: React.FC<React.PropsWithChildren<ContextSwitcherProps>> = ({
  menuItems,
  selectedItem,
  onSelect,
  resourceType = 'resource',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [menuDrilledIn, setMenuDrilledIn] = React.useState<string[]>([]);
  const [drilldownPath, setDrilldownPath] = React.useState<string[]>([]);
  const [menuHeights, setMenuHeights] = React.useState<{ [key: string]: number }>({});
  const [activeMenu, setActiveMenu] = React.useState<string>('context-switcher-root-menu');
  const [localStorage, setLocalStorage] = useLocalStorage<LocalStorageKeys>(LOCAL_STORAGE_KEY);

  const lastTab = React.useMemo(
    () => (localStorage as LocalStorageKeys)?.lastTab || {},
    [localStorage],
  );

  const [activeTab, setActiveTab] = React.useState<ContextTab>(
    lastTab[resourceType] === undefined ? ContextTab.All : lastTab[resourceType],
  );

  const privateMenuItems = React.useMemo(() => {
    return menuItems.filter((item) => item.visibility === ItemVisibility.PRIVATE);
  }, [menuItems]);

  const publicMenuItems = React.useMemo(() => {
    return menuItems.filter((item) => item.visibility === ItemVisibility.COMMUNITY);
  }, [menuItems]);

  const [filteredPrivateItems, filteredPublicItems, filteredAllItems] = React.useMemo(
    () => [
      filteredItems(privateMenuItems, searchText.toLowerCase()),
      filteredItems(publicMenuItems, searchText.toLowerCase()),
      filteredItems(menuItems, searchText.toLowerCase()),
    ],
    [menuItems, privateMenuItems, publicMenuItems, searchText],
  );

  const onItemSelect = (_: React.MouseEvent, key: string) => {
    const itemKey = key.startsWith('group:') ? key.replace('group:', '') : key;
    const item = findItemByKey(menuItems, itemKey);
    if (item.subItems?.length === 0) {
      return;
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
            <Tab eventKey={ContextTab.Private} title={<TabTitleText>Private</TabTitleText>}>
              <MenuList>
                {filteredPrivateItems.map((item) => (
                  <ContextMenuListItem key={item.key} item={item} />
                ))}
              </MenuList>
            </Tab>
            <Tab eventKey={ContextTab.Community} title={<TabTitleText>Public</TabTitleText>}>
              <MenuList>
                {filteredPublicItems.map((item) => (
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
        <MenuFooter>
          <Flex>
            <FlexItem align={{ default: 'alignRight' }}>
              <Button
                variant="link"
                component={(props) => (
                  <Link {...props} to={`/application-pipeline/workspace-list/`} />
                )}
                isInline
              >
                View workspace list
              </Button>
            </FlexItem>
          </Flex>
        </MenuFooter>
      </Menu>
    </Dropdown>
  );
};
