import * as React from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import classNames from 'classnames';

import './SimpleTabNav.scss';

export type SimpleTab = {
  name: string;
  component: React.ReactNode;
};

type SimpleTabNavProps = {
  tabs: SimpleTab[];
};

const SimpleTabNav: React.FC<SimpleTabNavProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = React.useState<string>(tabs[0].name);

  const handleOnClickTab = (event, tabName: string) => {
    setSelectedTab(tabName);
  };

  return (
    <Tabs onSelect={handleOnClickTab} activeKey={selectedTab}>
      {tabs.map((tab) => (
        <Tab
          key={tab.name}
          eventKey={tab.name}
          title={
            <TabTitleText
              className={classNames({
                'hacDev-simple-tab-nav__tab-title-active': tab.name === selectedTab,
                'hacDev-simple-tab-nav__tab-title': tab.name !== selectedTab,
              })}
            >
              {tab.name}
            </TabTitleText>
          }
        >
          {tab.component}
        </Tab>
      ))}
    </Tabs>
  );
};

export default SimpleTabNav;
