import { CatalogItem } from '../utils/types';

export const catalogItems: CatalogItem[] = [
  {
    uid: 'nodejs-basic',
    type: 'Sample',
    name: 'Basic NodeJS',
    description: 'A simple Hello world NodeJS application',
    tags: ['NodeJS', 'Express'],
    badges: [
      {
        text: 'NodeJS',
        color: 'green',
      },
    ],
    cta: {
      label: 'Create Devfile Sample',
      href: '/import?importType=devfile&formType=sample&devfileName=nodejs-basic&gitRepo=https://github.com/redhat-developer/devfile-sample.git',
    },
    icon: {
      url: 'data:image/png;base64,UklGRloqAABXRUJQVlA4TE0qAAAv/8A/ECrN7/8vd7Ur//8/dmx/v33cnwf5U+7n7r3W1aurV3E',
    },
  },
  {
    uid: 'python-basic',
    type: 'Sample',
    name: 'Basic Python',
    description: 'A simple Hello World application using Python',
    cta: {
      label: 'Create Devfile Sample',
      href: '/import?importType=devfile&formType=sample&devfileName=python-basic&gitRepo=https://github.com/elsony/devfile-sample-python-basic.git',
    },
    icon: {
      class: 'icon-python',
    },
  },
  {
    uid: 'code-with-quarkus',
    type: 'Sample',
    name: 'Basic Quarkus',
    description: 'A simple Hello World Java application using Quarkus',
    tags: ['Java', 'Quarkus'],
    cta: {
      label: 'Create Devfile Sample',
      href: '/import?importType=devfile&formType=sample&devfileName=code-with-quarkus&gitRepo=https://github.com/elsony/devfile-sample-code-with-quarkus.git',
    },
  },
  {
    uid: 'code-with-quarkus',
    type: 'OperatorBacked',
    name: 'Basic Quarkus',
    description: 'A simple Hello World Java application using Quarkus',
    tags: ['Java', 'Quarkus'],
    cta: {
      label: 'Create Devfile Sample',
      href: '/import?importType=devfile&formType=sample&devfileName=code-with-quarkus&gitRepo=https://github.com/elsony/devfile-sample-code-with-quarkus.git',
    },
  },
];
