import * as React from 'react';
import { ButtonProps, ButtonVariant } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import AnalyticsButton from '../../../components/AnalyticsButton/AnalyticsButton';
import { AnalyticsButtonProperties } from '../../../utils/analytics';

type ExternalLinkProps = {
  href: string;
  text?: React.ReactNode;
  additionalClassName?: string;
  dataTestID?: string;
  stopPropagation?: boolean;
  style?: React.CSSProperties;
  showIcon?: boolean;
  variant?: ButtonProps['variant'];
  icon?: ButtonProps['icon'];
  onClick?: ButtonProps['onClick'];
  analytics?: AnalyticsButtonProperties;
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
  icon,
  onClick,
}) => (
  <AnalyticsButton
    component="a"
    style={style}
    className={additionalClassName}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-test-id={dataTestID}
    isInline
    variant={variant}
    icon={icon}
    onClick={(e) => {
      if (stopPropagation) {
        e.stopPropagation();
      }
      onClick?.(e);
    }}
  >
    {children || text}
    {showIcon ? (
      <>
        {' '}
        <ExternalLinkAltIcon />
      </>
    ) : null}
  </AnalyticsButton>
);

export default ExternalLink;
