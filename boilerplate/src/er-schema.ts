export interface Attribute {
  name: string;
  type: string;
  description: string;
  forCreate: boolean;
  forUpdate: boolean;
  forDatabase: boolean;
  forGraphQL: boolean;
}

export interface Relationship {
  name: string;
  type: string;
  toEntity: string;
  description: string;
}

export interface ERSchema {
  entity: {
    name: string;
    namePlural: string;
    pk: string;
    attributes: Attribute[];
  };
  relationships: Relationship[];
}
