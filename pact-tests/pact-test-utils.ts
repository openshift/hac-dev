/* eslint-disable */
export enum Kind {
  Application,
  Component,
  Project,
  Route,
}

export class PactUrlUtil {
  static async getPath(kind: Kind, namespace: string, name: string): Promise<string> {
    let model = await import(`../src/models/${Kind[kind].toLowerCase()}`);
    let k8sModel = model[`${Kind[kind]}Model`];
    return `/apis/${k8sModel.apiGroup}/${k8sModel.apiVersion}/namespaces/${namespace}/${k8sModel.plural}/${name}`;
  }
}
