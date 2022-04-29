import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionGroup, Alert, Button, ButtonVariant } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons/dist/js/icons/download-icon';
import classNames from 'classnames';
import { Shadows, useScrollShadows, useScrollContainer } from '../../hooks';
import ButtonBar from '../button-bar/ButtonBar';
import { FormFooterProps } from './form-component-types';

import './FormFooter.scss';

const FormFooter: React.FC<FormFooterProps> = ({
  handleSubmit,
  handleReset,
  handleCancel,
  handleDownload,
  submitLabel,
  resetLabel,
  cancelLabel,
  infoTitle,
  infoMessage,
  isSubmitting,
  errorMessage,
  successMessage,
  disableSubmit,
  hideSubmit = false,
  showAlert,
  sticky,
}) => {
  const { t } = useTranslation();
  const [scrollContainer, footerElementRef] = useScrollContainer();
  const shadowPosition = useScrollShadows(sticky ? scrollContainer : null);
  return (
    <div
      className={classNames('hacDev-form-footer', {
        'hacDev-form-footer__sticky': sticky,
        'hacDev-form-footer__shadow':
          sticky && (shadowPosition === Shadows.both || shadowPosition === Shadows.bottom),
      })}
      data-test="form-footer"
      ref={footerElementRef}
    >
      <ButtonBar
        inProgress={isSubmitting}
        errorMessage={errorMessage}
        successMessage={successMessage}
      >
        {showAlert && (
          <Alert
            isInline
            className="hacDev-alert"
            variant="info"
            title={infoTitle || t('You made changes to this page.')}
          >
            {infoMessage ||
              t('Click {{submit}} to save changes or {{reset}} to cancel changes.', {
                submit: submitLabel,
                reset: resetLabel,
              })}
          </Alert>
        )}
        <ActionGroup className="pf-c-form hacDev-form-footer__no-top-margin">
          {!hideSubmit && (
            <Button
              type={handleSubmit ? 'button' : 'submit'}
              {...(handleSubmit && { onClick: handleSubmit })}
              variant={ButtonVariant.primary}
              isDisabled={disableSubmit}
              data-test="submit-button"
            >
              {submitLabel || t('Save')}
            </Button>
          )}
          {handleReset && (
            <Button
              type="button"
              data-test="reset-button"
              variant={ButtonVariant.secondary}
              onClick={handleReset}
            >
              {resetLabel || t('Reload')}
            </Button>
          )}
          {handleCancel && (
            <Button
              type="button"
              data-test="cancel-button"
              variant={ButtonVariant.link}
              onClick={handleCancel}
            >
              {cancelLabel || t('Cancel')}
            </Button>
          )}
          {handleDownload && (
            <Button
              type="button"
              data-test="download-button"
              variant={ButtonVariant.secondary}
              className="pf-c-button--align-right hidden-sm hidden-xs"
              onClick={handleDownload}
              icon={<DownloadIcon />}
            >
              {t('Download')}
            </Button>
          )}
        </ActionGroup>
      </ButtonBar>
    </div>
  );
};
export default FormFooter;
