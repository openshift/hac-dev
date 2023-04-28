import * as React from 'react';
import { InputField } from '../../../shared';

const GitOptions: React.FC = () => {
  return (
    <>
      <InputField
        name="source.git.revision"
        label="Git reference"
        helpText="Optional branch, tag or commit."
        data-test="git-reference"
      />

      <InputField
        name="source.git.context"
        label="Context dir"
        helpText="Optional subdirectory for the application source code."
        data-test="context-dir"
      />
    </>
  );
};

export default GitOptions;
