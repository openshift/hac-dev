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

export const getDevfileSamples = () =>
  fetch('https://registry.devfile.io/index/sample').then(async (response) => {
    const devfileSamples: DevfileSample[] = await response.json();
    return devfileSamples.map(({ projectType, language, git, ...item }) => ({
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
  });
