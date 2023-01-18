import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownSeparator,
  DropdownToggle,
  Flex,
  FlexItem,
  PageGroup,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import cx from 'classnames';
import BreadCrumbs from '../../shared/components/breadcrumbs/BreadCrumbs';

import './DetailsPage.scss';

type Action = { type?: string; key: string; label: React.ReactNode } & Omit<
  DropdownItemProps,
  'label'
>;
type DetailsPageTabProps = {
  key: string;
  label: string;
  component: React.ReactNode;
  isDisabled?: true;
  className?: string;
  isFilled?: boolean;
};

type DetailsPageProps = {
  title: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  breadcrumbItems?: React.ReactNode;
  actions?: Action[];
  tabs: DetailsPageTabProps[];
  baseURL: string;
  onTabSelect?: (selectedTabKey: string) => void;
};

const DetailsPage: React.FC<DetailsPageProps> = ({
  title,
  footer,
  description,
  breadcrumbs,
  breadcrumbItems,
  actions = [],
  tabs = [],
  baseURL,
  onTabSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useParams();
  const { activeTab: tab } = params;

  const activeTab = React.useMemo(() => tab || tabs?.[0]?.key, [tab, tabs]);
  const navigate = useNavigate();
  const setActiveTab = React.useCallback(
    (newTab: string) => {
      if (activeTab !== newTab) {
        navigate(`${baseURL}/${newTab}`);
      }
    },
    [activeTab, baseURL, navigate],
  );

  const dropdownItems = React.useMemo(
    () =>
      actions?.map((action) => {
        const { type, key, label, ...props } = action;
        if (type === 'separator') return <DropdownSeparator key={key} />;
        if (type === 'section-label')
          return (
            <DropdownItem key={key} data-test={key} {...props} isDisabled>
              <span className="pf-u-color-400 pf-u-font-size-sm">{label}</span>
            </DropdownItem>
          );
        return (
          <DropdownItem key={key} data-test={key} {...props}>
            {label}
          </DropdownItem>
        );
      }),
    [actions],
  );

  const tabComponents = tabs?.map(({ key, label, component, isFilled = true, ...rest }) => {
    return (
      <Tab
        data-test={`details__tabItem ${key}`}
        key={key}
        eventKey={key}
        title={<TabTitleText>{label}</TabTitleText>}
        className={cx('app-details__tabs__tabItem', { isFilled })}
        {...rest}
      >
        {component}
      </Tab>
    );
  });

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <Text component="h1" data-test="details__title">
          {title}
        </Text>
      );
    }
    return title;
  };

  return (
    <PageGroup data-test="details">
      <PageSection type="breadcrumb">
        {breadcrumbs && (
          <BreadCrumbs
            data-test="details__breadcrumbs"
            breadcrumbs={breadcrumbs}
            breadcrumbItems={breadcrumbItems}
          />
        )}
        <Flex style={{ paddingTop: 'var(--pf-global--spacer--lg)' }}>
          <FlexItem>
            <TextContent>
              {renderTitle()}
              {description && <Text component="p">{description}</Text>}
            </TextContent>
          </FlexItem>
          {actions?.length && (
            <FlexItem align={{ default: 'alignRight' }}>
              <Dropdown
                data-test="details__actions"
                position="right"
                toggle={
                  <DropdownToggle
                    onToggle={() => setIsOpen(!isOpen)}
                    toggleIndicator={CaretDownIcon}
                    isPrimary
                  >
                    Actions
                  </DropdownToggle>
                }
                onSelect={() => setIsOpen(!isOpen)}
                isOpen={isOpen}
                dropdownItems={dropdownItems}
              />
            </FlexItem>
          )}
        </Flex>
      </PageSection>
      {tabs?.length && (
        <PageSection className="app-details__tabs" isFilled variant={PageSectionVariants.light}>
          <Tabs
            data-test="app-details__tabs"
            onSelect={(e, k: string) => {
              setActiveTab(k);
              onTabSelect && onTabSelect(k);
            }}
            unmountOnExit
            activeKey={activeTab}
          >
            {tabComponents}
          </Tabs>
        </PageSection>
      )}
      {footer && (
        <PageSection variant={PageSectionVariants.light} isFilled={false} sticky="bottom">
          {footer}
        </PageSection>
      )}
    </PageGroup>
  );
};

export default DetailsPage;
