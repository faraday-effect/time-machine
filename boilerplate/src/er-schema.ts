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
  nullable: boolean = false; // Default for both TypeORM and TypeGraphQL

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
    if (opType === OpType.UPDATE || this.nullable) {
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

    const options: string[] = [];
    if (this.nullable) {
      options.push("nullable: true");
    }
    if (this.unique) {
      options.push("unique: true");
    }

    switch (this.type) {
      case "created":
        return "@CreateDateColumn()";
      case "updated":
        return "@UpdateDataColumn()";
      case "text":
        options.push('type: "text"');
      case "string":
      case "boolean":
        // TypeORM infers correct type from the declaration.
        break;
      default:
        throw Error(`Bogus type '${this.type}'`);
    }

    return `@Column(${Attribute.joinOptions(options)})`;
  }

  private typeDeclaration(opType: OpType) {
    const optional = opType === OpType.UPDATE ? "?" : "";

    switch (this.type) {
      case "created":
      case "updated":
        return `${this.name}${optional}: Date`;
      case "text":
        return `${this.name}${optional}: string`;
      case "string":
      case "boolean":
        return `${this.name}${optional}: ${this.type}`;
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
  nullable: boolean = true; // Default for TypeORM
  description: string = "";

  private gqlFIeld() {
    switch (this.type) {
      case "manyToOne":
        return `@Field(() => ${this.to})`;
      case "oneToMany":
      case "manyToMany":
      case "manyToManyOwner":
        return `@Field(() => [${this.to})]`;
    }
  }

  private dbRelation() {
    switch (this.type) {
      case "oneToMany":
        return "@OneToMany";
      case "manyToOne":
        return "@ManyToOne";
      case "manyToMany":
      case "manyToManyOwner":
        return "@ManyToMany";
    }
  }

  private inverseSide(entityName: string) {
    const toLower = this.to.toLowerCase();
    const entityLower = entityName.toLowerCase();
    const entityLowerPlural = pluralize(entityLower);

    switch (this.type) {
      case "oneToMany":
        return `${toLower} => ${toLower}.${entityLower}`;
      case "manyToOne":
      case "manyToMany":
      case "manyToManyOwner":
        return `${toLower} => ${toLower}.${entityLowerPlural}`;
    }
  }

  private typeDeclaration() {
    switch (this.type) {
      case "oneToMany":
      case "manyToMany":
      case "manyToManyOwner":
        return `${this.name}: ${this.to}[]`;
      case "manyToOne":
        return `${this.name}: ${this.to}`;
    }
  }

  public decorators(entityName: string) {
    const name = this.dbRelation();

    const allArgs = [`() => ${this.to}`, this.inverseSide(entityName)];
    if (!this.nullable) {
      // Only if not the default.
      allArgs.push("{ nullable: false }");
    }

    return [
      this.gqlFIeld(),
      `${name}(${allArgs.join(", ")})`,
      this.typeDeclaration()
    ].join("\n  ");
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

    const JOIN_STRING = ";\n\n  ";

    return {
      objectFields: objectFields.join(JOIN_STRING),
      inputFields: createFields.join(JOIN_STRING),
      updateFields: updateFields.join(JOIN_STRING)
    };
  }
}
