export interface DevfileSample {
  name?: string;
  displayName: string;
  description?: string;
  icon?: string;
  iconClass?: string;
  type: string;
  tags: string[];
  projectType?: string;
  language?: string;
  git?: {
    remotes: {
      [remote: string]: string;
    };
  };
  provider?: string;
}

type SampleOverride = {
  name?: string;
  description?: string;
  deprecated?: boolean;
};

const overrides: { [name: string]: SampleOverride } = {
  'nodejs-basic': {
    name: 'Node',
    description: 'Node.js 16 application using Express 4.18.x',
  },
  'code-with-quarkus': {
    name: 'Quarkus',
    description: 'Java Quarkus application using Maven 4.0 and OpenJDK 11',
  },
  'java-springboot-basic': {
    name: 'Spring Boot',
    description: 'Java Spring Boot application using Maven 4.0 and OpenJDK 11',
  },
  'python-basic': {
    name: 'Python',
    description: 'Python 3.9.x application with Flask',
  },
  'go-basic': {
    name: 'Go',
    description: 'Go 1.16 application',
  },
  'dotnet-basic': {
    deprecated: true,
  },
};

export const getDevfileSamples = () =>
  fetch('https://registry.devfile.io/index/sample').then(async (response) => {
    const devfileSamples: DevfileSample[] = await response.json();
    return devfileSamples
      .filter(({ name }) => !overrides[name]?.deprecated)
      .map(({ projectType, language, git, name, ...item }) => ({
        ...item,
        uid: name,
        name: overrides[name]?.name || item.displayName,
        description: overrides[name]?.description || item.description,
        icon: { url: item.icon },
        attributes: {
          projectType,
          language,
          git,
        },
      }));
  });
