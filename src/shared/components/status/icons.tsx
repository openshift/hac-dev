import * as React from 'react';
import { PencilAltIcon } from '@patternfly/react-icons/dist/js/icons/pencil-alt-icon';
import { global_palette_black_600 as grayColor } from '@patternfly/react-tokens/dist/js/global_palette_black_600';

export type ColoredIconProps = {
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const GrayPencilAltIcon: React.FC<
  ColoredIconProps & React.ComponentProps<typeof PencilAltIcon>
> = ({ className, title, size, ...props }) => (
  <PencilAltIcon
    data-test="pencil-icon"
    size={size}
    color={grayColor.value}
    className={className}
    title={title}
    {...props}
  />
);
