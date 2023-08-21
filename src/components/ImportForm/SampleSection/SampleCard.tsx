import * as React from 'react';
import { CatalogItem } from '@openshift/dynamic-plugin-sdk-extensions';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Badge,
  ButtonVariant,
  Button,
  Divider,
  TextContent,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/js/icons/arrow-right-icon';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { SampleAttrs } from '../utils/useDevfileSamples';

type SampleCardProps = {
  sample: CatalogItem<SampleAttrs>;
  onSampleImport: (url: string, name: string) => void;
};

const SampleCard: React.FC<SampleCardProps> = ({ sample, onSampleImport }) => {
  const { icon, name, tags, description, attributes } = sample;

  const sourceUrl = (attributes as SampleAttrs)?.git?.remotes?.origin;

  const badges = tags?.map((tag) => (
    <Badge key={tag} isRead>
      {tag}
    </Badge>
  ));

  const handleClick = React.useCallback(() => {
    onSampleImport(sourceUrl, name);
  }, [name, onSampleImport, sourceUrl]);

  return (
    <Card isFlat style={{ height: '100%' }} data-test={`${sample.type}-${sample.name}`}>
      <CardHeader
        {...(badges.length > 0 && {
          actions: { actions: <>{badges}</>, hasNoOffset: false, className: undefined },
        })}
      >
        {icon?.url && (
          <img
            className="catalog-tile-pf-icon"
            src={icon.url}
            alt={name}
            style={{ maxWidth: '60px', fontSize: 'var(--pf-v5-global--FontSize--md)' }}
          />
        )}
      </CardHeader>
      <CardTitle>{name}</CardTitle>
      <CardBody>
        <TextContent>{description}</TextContent>
      </CardBody>
      <CardFooter>
        <ExternalLink text="Open Git repository" href={sourceUrl} />
      </CardFooter>
      <Divider />
      <CardFooter>
        <Button
          data-test={`import-sample-${name}`}
          variant={ButtonVariant.link}
          isInline
          onClick={handleClick}
        >
          Import sample <ArrowRightIcon />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SampleCard;
