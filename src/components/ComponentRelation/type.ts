export enum NudgeContext {
  component = 'component',
  application = 'application',
}

export enum ComponentRelationNudgeType {
  NUDGES = 'nudges',
  NUDGED_BY = 'nudges-by',
}

export type ComponentRelationValue = {
  source: string;
  nudgeType: ComponentRelationNudgeType;
  target: string[];
};

export type ComponentRelationFormikValue = {
  relations: ComponentRelationValue[];
};
