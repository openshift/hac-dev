import * as React from 'react';
import {
  FormSection,
  Text,
  TextContent,
  TextVariants,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useFormikContext, useField } from 'formik';
import gitUrlParse from 'git-url-parse';
import { useAllEnvironments } from '../../../hooks/useAllEnvironments';
import { CheckboxField, DropdownField, InputField } from '../../../shared';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import { EnvironmentType, getEnvironmentType } from '../../Environment/environment-utils';
import { AccessHelpText } from '../../ImportForm/SourceSection/SourceSection';
import { useAccessCheck } from '../../ImportForm/utils/auth-utils';
import { gitUrlRegex, RESOURCE_NAME_REGEX_MSG } from '../../ImportForm/utils/validation-utils';
import { ENVIRONMENTS, IntegrationTestFormValues } from './types';
import './IntegrationTestSection.scss';

type Props = { isInPage?: boolean; edit?: boolean };

const IntegrationTestSection: React.FC<Props> = ({ isInPage, edit }) => {
  const [, { value: source }] = useField<string>({
    name: 'integrationTest.url',
    type: 'input',
  });

  const [, { value: ITSEnvName }] = useField<string>({
    name: 'integrationTest.environmentName',
    type: 'dropdown',
  });
  const [environments, environmentsLoaded] = useAllEnvironments();
  // const [currentEnvironment, setCurrentEnvironment] = React.useState<string>(
  //   ITSEnvName ?? ENVIRONMENTS.DEFAULT,
  // );

  const dropdownItems = React.useMemo(() => {
    const items = [{ key: 'none', value: 'No environment' }];
    environmentsLoaded &&
      Array.isArray(environments) &&
      environments.length > 0 &&
      environments.forEach((env) => {
        const envType = getEnvironmentType(env); // only Static and default(dev) environment to be used
        if (envType === EnvironmentType.static || envType === EnvironmentType.default) {
          items.push({ key: env.metadata.name, value: env.metadata.name });
        }
      });
    return items;
  }, [environments, environmentsLoaded]);

  const [, { value: isValidated }] = useField<boolean>('source.isValidated');

  const {
    values: { secret: authSecret },
    setFieldValue,
  } = useFormikContext<IntegrationTestFormValues>();

  const setEnvironment = (envName) => {
    if (envName === ENVIRONMENTS.DEFAULT) {
      setFieldValue('integrationTest.environmentName', null);
      setFieldValue('integrationTest.environmentType', null);
    } else {
      const environment = environments.find((env) => env.metadata.name === envName);
      setFieldValue('integrationTest.environmentName', environment.metadata.name);
      setFieldValue('integrationTest.environmentType', environment.spec.type);
    }
  };

  const [sourceUrl, setSourceUrl] = React.useState('');
  const [validated, setValidated] = React.useState(null);

  const [helpText, setHelpText] = React.useState(
    isValidated ? AccessHelpText.validated : AccessHelpText.default,
  );
  const [helpTextInvalid, setHelpTextInvalid] = React.useState('');

  const [{ isGit, isRepoAccessible, serviceProvider }, accessCheckLoaded] = useAccessCheck(
    isValidated ? null : sourceUrl,
    authSecret,
  );

  const setFormValidating = React.useCallback(() => {
    setValidated(ValidatedOptions.default);
    setHelpText(AccessHelpText.checking);
    setFieldValue('source.isValidated', false);
  }, [setFieldValue]);

  const setFormValidated = React.useCallback(() => {
    setValidated(ValidatedOptions.success);
    setHelpText(AccessHelpText.validated);
    setFieldValue('source.isValidated', true);
  }, [setFieldValue]);

  const handleSourceChange = React.useCallback(() => {
    const searchTerm = source;
    const isGitUrlValid = gitUrlRegex.test(searchTerm?.trim());
    if (!searchTerm || !isGitUrlValid) {
      setValidated(ValidatedOptions.error);
      setHelpTextInvalid('Invalid URL');
      setSourceUrl(null);
      return;
    }
    setFormValidating();
    setHelpTextInvalid('');
    setSourceUrl(searchTerm);
  }, [source, setFormValidating]);

  const debouncedHandleSourceChange = useDebounceCallback(handleSourceChange);

  // TODO: Remove when it is fixed in formik-pf
  React.useEffect(() => {
    if (accessCheckLoaded) {
      if (isRepoAccessible) {
        try {
          const { organization } = gitUrlParse(sourceUrl);
          if (!organization) {
            setValidated(ValidatedOptions.error);
            setHelpTextInvalid('Not a valid source repository');
            return;
          }
        } catch {
          // ignore, should never happen when isRepoAccessible is true, but for tests it is not valid
        }
        setFormValidated();
      } else {
        setValidated(ValidatedOptions.error);
        setHelpTextInvalid('Unable to access repository');
      }
    }
  }, [
    accessCheckLoaded,
    isRepoAccessible,
    isGit,
    serviceProvider,
    setFieldValue,
    setFormValidated,
    sourceUrl,
  ]);

  return (
    <>
      {!isInPage && (
        <>
          <TextContent data-test="integration-test-section-header">
            <Text component={TextVariants.h1}>Add integration test</Text>
            <Text component={TextVariants.p}>
              Test all your components after you commit code by adding an integration test.
              Integration tests run in parallel using temporary environments. Only validated
              versions of applications will be deployed.
            </Text>
          </TextContent>
        </>
      )}
      <FormSection>
        <InputField
          label="Integration test name"
          name="integrationTest.name"
          helpText={edit ? '' : RESOURCE_NAME_REGEX_MSG}
          data-test="display-name-input"
          isDisabled={edit}
          required
        />
        <InputField
          name="integrationTest.url"
          placeholder="Enter your source"
          onChange={debouncedHandleSourceChange}
          validated={validated}
          helpText={helpText}
          label="GitHub URL"
          helpTextInvalid={helpTextInvalid}
          required
          data-test="git-url-input"
        />
        <InputField
          name="integrationTest.revision"
          label="Revision"
          helpText="Branch, tag or commit."
          data-test="git-revision"
        />
        <InputField
          name="integrationTest.path"
          label="Path in repository"
          helpText="Where to find the file in your repository."
          data-test="git-path-repo"
          required
        />
        <DropdownField
          name={'integrationTest.environmentName'}
          label="Environment"
          placeholder={ITSEnvName ? ITSEnvName : ENVIRONMENTS.DEFAULT}
          onChange={setEnvironment}
          items={dropdownItems}
          helpText="If this test needs a temporary deployment, select an environment. We'll clone the environment each time the test runs, then delete it after."
          isDisabled={edit}
          className="integration-test-section__dropdown"
        />
        <CheckboxField
          name="integrationTest.optional"
          aria-label="Mark as optional for release"
          label="Mark as optional for release"
          helpText="Passing this test is optional, and it cannot prevent the application from being deployed or released."
          data-test="optional-release-checkbox"
        />
      </FormSection>
    </>
  );
};

export default IntegrationTestSection;
