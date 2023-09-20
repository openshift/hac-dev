import * as React from 'react';
import { screen } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import { ReleaseService } from '../ReleaseService';

describe('ReleaseService', () => {
  it('should render release service page', () => {
    routerRenderer(<ReleaseService />);
    screen.getByText('Release Plan');
  });
});
