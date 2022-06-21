export type ResourceStatusCondition = {
  type: string;
  status: 'True' | 'False';
  reason: 'OK' | 'Error';
  message: string;
};
