import pluralize from "pluralize";
import { Type } from "class-transformer";

type AttributeType =
  | "string"
  | "text"
  | "boolean"
  | "created"
  | "updated"
  | null;

type RelationshipType =
  | "oneToMany"
  | "manyToOne"
  | "manyToMany"
  | "manyToManyOwner"
  | null;

export enum OpType {
  OBJECT,
  CREATE,
  UPDATE
}

export class Attribute {
  name: string = "";
  type: AttributeType = null;
  description: string = "";
  unique: boolean = false;
  isDbColumn: boolean = true;
  isGqlField: boolean = true;
  forGqlCreate: boolean = true;
  forGqlUpdate: boolean = true;

  private static joinOptions(options: string[]) {
    let allOptions = options.join(", ");
    if (allOptions) {
      allOptions = `{ ${allOptions} }`;
    }
    return allOptions;
  }

  private gqlField(opType: OpType) {
    if (!this.isGqlField) {
      return "";
    }

    const options = [`description: "${this.description}"`];
    if (opType === OpType.UPDATE) {
      options.push("nullable: true");
    }

    switch (this.type) {
      case "string":
        break;
      case "text":
        break;
      case "boolean":
        break;
      case "created":
        break;
      case "updated":
        break;
      default:
        throw Error(`Bogus type '${this.type}'`);
    }

    return `@Field(${Attribute.joinOptions(options)})`;
  }

  private dbColumn(opType: OpType) {
    if (!this.isDbColumn || opType !== OpType.OBJECT) {
      return "";
    }

    const options = [`type: ${this.type}`];

    switch (this.type) {
      case "created":
        return "@CreateDateColumn()";
      case "updated":
        return "@UpdateDataColumn()";
      case "text":
      case "string":
      case "boolean":
        break;
      default:
        throw Error(`Bogus type '${this.type}'`);
    }

    if (this.unique) {
      options.push("unique: true");
    }

    return `@Column(${Attribute.joinOptions(options)})`;
  }

  private typeDeclaration(opType: OpType) {
    switch (this.type) {
      case "created":
      case "updated":
        return `${this.name}: Date`;
      case "text":
        return `${this.name}: string`;
      case "string":
      case "boolean":
        return `${this.name}: ${this.type}`;
        break;
      default:
        throw Error(`Bogus type '${this.type}'`);
    }
  }

  public decorators(opType: OpType) {
    if (
      (opType === OpType.CREATE && !this.forGqlCreate) ||
      (opType === OpType.UPDATE && !this.forGqlUpdate)
    ) {
      return "";
    }

    return [
      this.gqlField(opType),
      this.dbColumn(opType),
      this.typeDeclaration(opType)
    ].join(" ");
  }
}

export class Entity {
  name: string = "";
  namePlural: string = "";
  pk: string = "";
  @Type(() => Attribute)
  attributes: Attribute[] = [];
}

export class Relationship {
  name: string = "";
  type: RelationshipType = null;
  to: string = "";
  description: string = "";

  public decorators(entityName: string) {
    const toLower = this.to.toLowerCase();
    const entityLower = entityName.toLowerCase();
    const entityLowerPlural = pluralize(entityLower);

    switch (this.type) {
      case "oneToMany":
        return `@OneToMany(() => ${this.to}, ${toLower} => ${toLower}.${entityLower}) 
          ${this.name}: ${this.to}[]`;
      case "manyToOne":
        return `@ManyToOne(() => ${this.to}, ${toLower} => ${toLower}.${entityLowerPlural})
           ${this.name}: ${this.to}`;
      case "manyToMany":
        return `@ManyToMany(() => ${this.to}, ${toLower} => ${toLower}.${entityLowerPlural})
           ${this.name}: ${this.to}[]`;
      case "manyToManyOwner":
        return `@ManyToMany(() => ${this.to}, ${toLower} => ${toLower}.${entityLowerPlural})
          @JoinTable()
          ${this.name}: ${this.to}[]`;
      default:
        throw Error(`Invalid relationship type '${this.type}'`);
    }
  }
}

export class ERSchema {
  @Type(() => Entity)
  entity: Entity = {} as Entity;
  @Type(() => Relationship)
  relationships: Relationship[] = [];

  declareFields() {
    const objectFields: string[] = [];
    const createFields: string[] = [];
    const updateFields: string[] = [];

    // Primary key
    objectFields.push(
      `@Field(() => Int) @PrimaryGeneratedColumn() ${this.entity.pk}: number`
    );
    updateFields.push(`@Field(() => Int) ${this.entity.pk}: number`);

    // Other attributes
    for (const attr of this.entity.attributes) {
      objectFields.push(attr.decorators(OpType.OBJECT));
      createFields.push(attr.decorators(OpType.CREATE));
      updateFields.push(attr.decorators(OpType.UPDATE));
    }

    // Relationships
    for (const rel of this.relationships) {
      objectFields.push(rel.decorators(this.entity.name));
    }

    return {
      objectFields: objectFields.join(";\n  "),
      inputFields: createFields.join(";\n  "),
      updateFields: updateFields.join(";\n  ")
    };
  }
}
