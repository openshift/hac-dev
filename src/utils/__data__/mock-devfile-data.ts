import { DevfileSample } from '../devfile-utils';

export const mockItems: DevfileSample[] = [
  {
    name: 'nodejs-basic',
    displayName: 'Basic Node.js',
    description: 'A simple Hello World Node.js application',
    type: 'sample',
    tags: ['Node.js', 'Express'],
    icon: 'https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg',
    projectType: 'Node.js',
    language: 'JavaScript',
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
    projectType: 'Quarkus',
    language: 'Java',
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
    icon: 'https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg',
    projectType: 'springboot',
    language: 'Java',
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
    tags: ['Python', 'Pip', 'Flask'],
    icon: 'https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/python.svg',
    projectType: 'Python',
    language: 'Python',
    git: {
      remotes: {
        origin: 'https://github.com/devfile-samples/devfile-sample-python-basic.git',
      },
    },
    provider: 'Red Hat',
  },
  {
    name: 'go-basic',
    displayName: 'Basic Go',
    description: 'A simple Hello World application using Go',
    type: 'sample',
    tags: ['Go'],
    icon: 'https://go.dev/blog/go-brand/Go-Logo/SVG/Go-Logo_Blue.svg',
    projectType: 'Go',
    language: 'Go',
    git: {
      remotes: {
        origin: 'https://github.com/devfile-samples/devfile-sample-go-basic.git',
      },
    },
    provider: 'Red Hat',
  },
  {
    name: 'dotnet-basic',
    displayName: 'Basic .NET',
    description: 'A simple application using .NET 6.0',
    type: 'sample',
    tags: ['.NET'],
    icon: 'https://github.com/dotnet/brand/raw/main/logo/dotnet-logo.png',
    projectType: 'dotnet',
    language: '.NET',
    git: {
      remotes: {
        origin: 'https://github.com/devfile-samples/devfile-sample-dotnet60-basic.git',
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
