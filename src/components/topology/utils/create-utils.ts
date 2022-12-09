import { PipelineNodeModel } from '@patternfly/react-topology';

export type GenericNodeData = {
  label?: string;
  runAfterTasks?: string[];
  selected?: boolean;
  isDisabled?: boolean;
  width?: number;
  height?: number;
};

export type NodeModel<D extends GenericNodeData, T> = Omit<PipelineNodeModel, 'type'> & {
  data: D;
  type: T;
};

export type NodeCreator<D extends GenericNodeData, T> = (name: string, data: D) => NodeModel<D, T>;

export type NodeCreatorSetup = <T>(
  type: T,
  width?: number,
  height?: number,
) => <D extends GenericNodeData>(name: string, data?: D) => NodeModel<D, T>;

export const createGenericNode: NodeCreatorSetup =
  <T>(type: T, width?: number, height?: number) =>
  <D extends GenericNodeData>(name: string, data?: D) => ({
    id: name,
    label: data?.label || name,
    runAfterTasks: data?.runAfterTasks || [],
    ...(data && { data }),
    height,
    width,
    type,
  });
