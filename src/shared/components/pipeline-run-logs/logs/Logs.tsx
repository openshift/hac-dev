import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { commonFetchText, getK8sResourceURL } from '@openshift/dynamic-plugin-sdk-utils';
import { Alert } from '@patternfly/react-core';
import './Logs.scss';
import { ContainerSpec, PodKind } from '../../types';
import { LOG_SOURCE_TERMINATED, PodModel } from '../utils';

type LogsProps = {
  resource: PodKind;
  resourceStatus: string;
  container: ContainerSpec;
  render: boolean;
  autoScroll?: boolean;
  onComplete: (containerName: string) => void;
};

const Logs: React.FC<LogsProps> = ({
  resource,
  resourceStatus,
  container,
  onComplete,
  render,
  autoScroll = true,
}) => {
  const { t } = useTranslation();
  const { name } = container;
  const { kind, metadata = {} } = resource;
  const { name: resName, namespace: resNamespace } = metadata;
  const scrollToRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<boolean>(false);
  const resourceStatusRef = React.useRef<string>(resourceStatus);
  const onCompleteRef = React.useRef<(name) => void>();
  onCompleteRef.current = onComplete;

  const appendMessage = React.useRef<(blockContent) => void>();

  appendMessage.current = React.useCallback(
    (blockContent: string) => {
      if (contentRef.current && blockContent) {
        contentRef.current.innerText += blockContent;
      }
      if (scrollToRef.current && blockContent && render && autoScroll) {
        scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [autoScroll, render],
  );

  if (resourceStatusRef.current !== resourceStatus) {
    resourceStatusRef.current = resourceStatus;
  }

  React.useEffect(() => {
    let loaded: boolean = false;
    // let ws;
    const urlOpts = {
      ns: resNamespace,
      name: resName,
      path: 'log',
      queryParams: {
        container: name,
        follow: 'true',
      },
    };
    if (resourceStatusRef.current === LOG_SOURCE_TERMINATED) {
      commonFetchText(getK8sResourceURL(PodModel, undefined, urlOpts))
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
      // no support for websockets yet
      // const wsOpts = {
      //   host: 'auto',
      //   path: watchURL,
      //   subprotocols: ['base64.binary.k8s.io'],
      // };
      // ws = new WSFactory(watchURL, wsOpts);
      // ws.onmessage((msg) => {
      //   if (loaded) return;
      //   const message = Base64.decode(msg);
      //   appendMessage.current(message);
      // })
      //   .onclose(() => {
      //     onCompleteRef.current(name);
      //   })
      //   .onerror(() => {
      //     if (loaded) return;
      //     setError(true);
      //     onCompleteRef.current(name);
      //   });
    }
    return () => {
      loaded = true;
      // ws && ws.destroy();
    };
  }, [kind, name, resName, resNamespace]);

  React.useEffect(() => {
    if (scrollToRef.current && render && autoScroll) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll, render]);

  return (
    <div className="odc-logs" style={{ display: render ? '' : 'none' }}>
      <p className="odc-logs__name">{name}</p>
      {error && (
        <Alert
          variant="danger"
          isInline
          title={t('An error occurred while retrieving the requested logs.')}
        />
      )}
      <div>
        <div className="odc-logs__content" ref={contentRef} />
        <div ref={scrollToRef} />
      </div>
    </div>
  );
};

export default Logs;
