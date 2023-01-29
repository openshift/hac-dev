import * as React from 'react';
import { Button, ButtonProps, ButtonVariant } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

type ExternalLinkProps = {
  href: string;
  text?: React.ReactNode;
  additionalClassName?: string;
  dataTestID?: string;
  stopPropagation?: boolean;
  style?: React.CSSProperties;
  showIcon?: boolean;
  variant?: ButtonProps['variant'];
};

const ExternalLink: React.FC<ExternalLinkProps> = ({
  children,
  href,
  text,
  additionalClassName = '',
  dataTestID,
  stopPropagation,
  style,
  showIcon,
  variant = ButtonVariant.link,
}) => (
  <Button
    component="a"
    style={style}
    className={additionalClassName}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-test-id={dataTestID}
    {...(stopPropagation ? { onClick: (e) => e.stopPropagation() } : {})}
    isInline
    variant={variant}
  >
    {children || text}
    {showIcon ? (
      <>
        {' '}
        <ExternalLinkAltIcon />
      </>
    ) : null}
  </Button>
);

export default ExternalLink;
