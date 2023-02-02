import React from 'react';
import { Banner, Button, Popover } from '@patternfly/react-core';

import './AppBanner.scss';

const AppBanner: React.FC = () => {
  return (
    <div data-test="dev-preview-banner">
      <Banner variant="info" className="app-banner" isSticky>
        <Popover
          position="bottom"
          bodyContent={
            <div data-test="dev-preview-banner-popover">
              Private preview releases provide early access to a limited set of features that might
              not be fully tested. Users should not use private preview software in production or
              for business-critical workloads.
            </div>
          }
        >
          <Button variant="link" isInline>
            Private Preview
          </Button>
        </Popover>
      </Banner>
    </div>
  );
};

export default AppBanner;
