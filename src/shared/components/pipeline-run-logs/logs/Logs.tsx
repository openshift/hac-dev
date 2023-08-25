import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  commonFetchText,
  getK8sResourceURL,
  QueryOptions,
  WebSocketFactory,
} from '@openshift/dynamic-plugin-sdk-utils';
import { Alert } from '@patternfly/react-core';
import { Base64 } from 'js-base64';
import { PodModel } from '../../../../models/pod';
import { ContainerSpec, PodKind } from '../../types';
import { LOG_SOURCE_TERMINATED } from '../utils';

import './Logs.scss';

type LogsProps = {
  resource: PodKind;
  resourceStatus: string;
  container: ContainerSpec;
  render: boolean;
  autoScroll?: boolean;
  onComplete: (containerName: string) => void;
  errorMessage?: string;
};

const Logs: React.FC<LogsProps> = ({
  resource,
  resourceStatus,
  container,
  onComplete,
  render,
  autoScroll = true,
  errorMessage,
}) => {
  const { t } = useTranslation();
  const { name } = container;
  const { kind, metadata = {} } = resource || {};
  const { name: resName, namespace: resNamespace } = metadata;
  const scrollToRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<boolean>(false);
  const resourceStatusRef = React.useRef<string>(resourceStatus);
  const blockContentRef = React.useRef<string>('');
  const rafRef = React.useRef(null);
  const autoScrollRef = React.useRef<boolean>(autoScroll);
  autoScrollRef.current = autoScroll;

  const onCompleteRef = React.useRef<(name) => void>();
  onCompleteRef.current = onComplete;

  const appendMessage = React.useRef<(blockContent) => void>();

  const safeScroll = React.useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (contentRef.current) contentRef.current.textContent += blockContentRef.current;

        if (autoScrollRef.current && scrollToRef.current && scrollToRef.current.scrollIntoView) {
          scrollToRef.current.scrollIntoView({ behavior: 'instant' as ScrollBehavior }); // Todo: remove type casting when typescript fixes this issue - https://github.com/microsoft/TypeScript/issues/47441
        }
        blockContentRef.current = '';
        rafRef.current = null;
      });
    }
  }, []);

  appendMessage.current = React.useCallback(
    (blockContent: string) => {
      if (contentRef.current && blockContent) {
        blockContentRef.current += blockContent;
      }
      if (scrollToRef.current && blockContent && render && autoScroll) {
        safeScroll();
      }
    },
    [autoScroll, render, safeScroll],
  );

  if (resourceStatusRef.current !== resourceStatus) {
    resourceStatusRef.current = resourceStatus;
  }

  React.useEffect(() => {
    let loaded: boolean = false;
    let ws: WebSocketFactory;
    const urlOpts: QueryOptions = {
      ns: resNamespace,
      name: resName,
      path: 'log',
      queryParams: {
        container: name,
        follow: 'true',
      },
    };
    const watchURL = getK8sResourceURL(PodModel, undefined, urlOpts);
    if (resourceStatusRef.current === LOG_SOURCE_TERMINATED) {
      commonFetchText(watchURL)
        .then((res) => {
          if (loaded) return;
          appendMessage.current(res);
          onCompleteRef.current(name);
        })
        .catch(() => {
          if (loaded) return;
          setError(true);
          onCompleteRef.current(name);
        });
    } else {
      const wsOpts = {
        path: watchURL,
      };
      ws = new WebSocketFactory(watchURL, wsOpts);
      ws.onMessage((msg) => {
        if (loaded) return;
        const message = Base64.decode(msg as string);
        appendMessage.current(message);
      })
        .onClose(() => {
          onCompleteRef.current(name);
        })
        .onError(() => {
          if (loaded) return;
          setError(true);
          onCompleteRef.current(name);
        });
    }
    return () => {
      loaded = true;
      ws && ws.destroy();
    };
  }, [kind, name, resName, resNamespace]);

  React.useEffect(() => {
    if (scrollToRef.current && render && autoScroll) {
      safeScroll();
    }
  }, [autoScroll, render, safeScroll]);

  return (
    <div className="logs" data-testid="logs-container" style={{ display: render ? '' : 'none' }}>
      <p className="logs__name">{name}</p>
      {error ||
        (!resource && errorMessage && (
          <Alert
            data-testid="error-message"
            variant="danger"
            isInline
            title={
              errorMessage
                ? errorMessage
                : t('An error occurred while retrieving the requested logs.')
            }
          />
        ))}
      <div>
        <div className="logs__content" data-testid="logs-content" ref={contentRef} />
        <div ref={scrollToRef} />
      </div>
    </div>
  );
};

export default Logs;
