import { DevfileSample } from '../devfile-utils';

export const mockItems: DevfileSample[] = [
  {
    name: 'nodejs-basic',
    displayName: 'Basic Node.js',
    description: 'A simple Hello World Node.js application',
    type: 'sample',
    tags: ['NodeJS', 'Express'],
    icon: 'https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg',
    projectType: 'nodejs',
    language: 'nodejs',
    git: {
      remotes: {
        origin: 'https://github.com/nodeshift-starters/devfile-sample.git',
      },
    },
    provider: 'Red Hat',
  },
  {
    name: 'code-with-quarkus',
    displayName: 'Basic Quarkus',
    description: 'A simple Hello World Java application using Quarkus',
    type: 'sample',
    tags: ['Java', 'Quarkus'],
    icon: 'https://design.jboss.org/quarkus/logo/final/SVG/quarkus_icon_rgb_default.svg',
    projectType: 'quarkus',
    language: 'java',
    git: {
      remotes: {
        origin: 'https://github.com/devfile-samples/devfile-sample-code-with-quarkus.git',
      },
    },
    provider: 'Red Hat',
  },
  {
    name: 'java-springboot-basic',
    displayName: 'Basic Spring Boot',
    description: 'A simple Hello World Java Spring Boot application using Maven',
    type: 'sample',
    tags: ['Java', 'Spring'],
    icon: 'https://spring.io/images/projects/spring-edf462fec682b9d48cf628eaf9e19521.svg',
    projectType: 'springboot',
    language: 'java',
    git: {
      remotes: {
        origin: 'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
      },
    },
    provider: 'Red Hat',
  },
  {
    name: 'python-basic',
    displayName: 'Basic Python',
    description: 'A simple Hello World application using Python',
    type: 'sample',
    tags: ['Python'],
    icon: 'https://www.python.org/static/community_logos/python-logo-generic.svg',
    projectType: 'python',
    language: 'python',
    git: {
      remotes: {
        origin: 'https://github.com/devfile-samples/devfile-sample-python-basic.git',
      },
    },
    provider: 'Red Hat',
  },
];

export const mockCatalogItem = mockItems.map(({ projectType, language, git, ...item }) => ({
  ...item,
  uid: item.name,
  name: item.displayName,
  icon: { url: item.icon },
  attributes: {
    projectType,
    language,
    git,
  },
}));
