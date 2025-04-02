import React from 'react';
import { Banner, Button } from '@patternfly/react-core';

import './AppBanner.scss';

const AppBanner: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div data-test="dev-preview-banner">
      <Banner variant="blue" className="app-banner" isSticky>
        🎉 We’ve launched Konflux UI! The current version will be deprecated soon.{' '}
        <Button
          variant="link"
          href="https://konflux.pages.redhat.com/docs/users/getting-started/ui-versions.html"
          target="_blank"
          isInline
        >
          Visit the documentation
        </Button>{' '}
        to find the UI for your specific cluster.
      </Banner>
    </div>
  );
};

export default AppBanner;
