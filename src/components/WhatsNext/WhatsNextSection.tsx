import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  HelperText,
  PageSection,
  PageSectionVariants,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/js/icons/arrow-right-icon';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';

import './WhatsNextSection.scss';

export type WhatsNextItem = {
  title: string;
  description: string;
  icon: string;
  helpId?: string;
  cta?: {
    label: string;
    href?: string;
    external?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    disabledTooltip?: string;
    analytics?: React.ComponentProps<typeof ButtonWithAccessTooltip>['analytics'];
  };
};

type WhatsNextSectionProps = {
  whatsNextItems: WhatsNextItem[];
};

const WhatsNextSection: React.FunctionComponent<WhatsNextSectionProps> = ({ whatsNextItems }) => {
  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      <Title size="lg" headingLevel="h3" className="pf-v5-u-mt-lg pf-v5-u-mb-sm">
        What&apos;s next?
      </Title>
      {whatsNextItems.map((item) => (
        <Card className="whats-next-card" key={item.title} isFlat>
          <SplitItem>
            <img src={item.icon} alt={item.title} className="whats-next-card__icon" />
          </SplitItem>
          <SplitItem className="whats-next-card__content" isFilled>
            <Title headingLevel="h4">{item.title}</Title>
            <HelperText>{item.description}</HelperText>
          </SplitItem>
          <SplitItem className="whats-next-card__cta">
            <ButtonWithAccessTooltip
              {...(item.cta.onClick
                ? { onClick: item.cta.onClick }
                : !item.cta.external
                ? {
                    component: (props) => <Link {...props} to={item.cta.href} />,
                  }
                : {
                    component: 'a',
                    href: item.cta.href,
                    target: '_blank',
                    rel: 'noreferrer',
                  })}
              isDisabled={item.cta.disabled}
              tooltip={item.cta.disabledTooltip}
              variant="secondary"
              analytics={item.cta.analytics}
            >
              {item.cta.label}
            </ButtonWithAccessTooltip>
            {item.helpId && (
              <HelpTopicLink topicId={item.helpId}>
                Learn more <ArrowRightIcon />
              </HelpTopicLink>
            )}
          </SplitItem>
        </Card>
      ))}
    </PageSection>
  );
};

export default WhatsNextSection;
