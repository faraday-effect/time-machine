import { plainToClass, Type } from "class-transformer";
import { InflectionTable, lowerFirst } from "./helpers";
import { readFileSync } from "fs";
import { join } from "path";

type AttributeType =
  | "string"
  | "text"
  | "boolean"
  | "integer"
  | "float"
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

function joinOptions(options: string[]) {
  let allOptions = options.join(", ");
  if (allOptions) {
    allOptions = `{ ${allOptions} }`;
  }
  return allOptions;
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

  private gqlField(opType: OpType) {
    if (!this.isGqlField) {
      return "";
    }

    let gqlType: string | null = null;
    switch (this.type) {
      case "string":
      case "text":
      case "boolean":
      case "created":
      case "updated":
        // NOP
        break;
      case "integer":
        gqlType = "() => Int";
        break;
      case "float":
        gqlType = "() => Float";
        break;
      default:
        throw Error(`Bogus type '${this.type}'`);
    }

    const advancedOptions = [`description: "${this.description}"`];
    if (opType === OpType.UPDATE || this.nullable) {
      advancedOptions.push("nullable: true");
    }

    const allOptions = [joinOptions(advancedOptions)];
    if (gqlType) {
      allOptions.unshift(gqlType);
    }

    return `@Field(${allOptions.join(", ")})`;
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
        break;
      case "string":
      case "boolean":
        // TypeORM infers correct type from the declaration.
        break;
      default:
        throw Error(`Bogus type '${this.type}'`);
    }

    return `@Column(${joinOptions(options)})`;
  }

  private typeDeclaration(opType: OpType) {
    const optional = opType === OpType.UPDATE ? "?" : "";

    let tsType = "";
    switch (this.type) {
      case "created":
      case "updated":
        tsType = "Date";
        break;
      case "text":
        tsType = "string";
        break;
      case "integer":
      case "float":
        tsType = "number";
        break;
      case "string":
      case "boolean":
        tsType = this.type;
        break;
      default:
        throw Error(`Bogus type '${this.type}'`);
    }

    return `${this.name}${optional}: ${tsType}`;
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

  private relationId() {
    const columnName = lowerFirst(this.name) + "Id";

    // This only belongs on side of the relationship where the FK lives.
    switch (this.type) {
      case "manyToOne":
        return `@Column("integer") ${columnName}: number`;
      case "manyToManyOwner": // Maybe for this also?
      case "oneToMany":
      case "manyToMany":
        return null;
    }
  }

  private gqlField() {
    switch (this.type) {
      case "manyToOne":
        return `@Field(() => ${this.to})`;
      case "oneToMany":
      case "manyToMany":
      case "manyToManyOwner":
        return `@Field(() => [${this.to}])`;
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

  private inverseSide(inflections: InflectionTable) {
    const toLower = lowerFirst(this.to);

    switch (this.type) {
      case "oneToMany":
        return `${toLower} => ${toLower}.${inflections.entityLower}`;
      case "manyToOne":
      case "manyToMany":
      case "manyToManyOwner":
        return `${toLower} => ${toLower}.${inflections.entityLowerPlural}`;
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

  public decorators(inflections: InflectionTable) {
    const name = this.dbRelation();

    const allArgs = [`() => ${this.to}`, this.inverseSide(inflections)];
    if (!this.nullable) {
      // Only if not the default.
      allArgs.push("{ nullable: false }");
    }

    const options = [this.gqlField(), `${name}(${allArgs.join(", ")})`];

    if (this.type === "manyToManyOwner") {
      options.push("@JoinTable()");
    }

    options.push(this.typeDeclaration() + ";");

    const relationId = this.relationId();
    if (relationId) {
      options.push(relationId + ";");
    }

    return options.join("\n  ");
  }
}

export class ERSchema {
  @Type(() => Entity)
  entity: Entity = {} as Entity;
  @Type(() => Relationship)
  relationships: Relationship[] = [];
  inflections: InflectionTable = {} as InflectionTable;

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
      objectFields.push(rel.decorators(this.inflections));
    }

    const JOIN_STRING = ";\n\n  ";

    return {
      objectFields: objectFields.join(JOIN_STRING),
      inputFields: createFields.join(JOIN_STRING),
      updateFields: updateFields.join(JOIN_STRING)
    };
  }
}

export function loadSchema(name: string) {
  const plainObject = JSON.parse(
    readFileSync(join(__dirname, "..", name), "utf-8")
  );
  const schema = plainToClass(ERSchema, plainObject);
  schema.inflections = new InflectionTable(schema.entity.name);
  return schema;
}

// Credits:
// https://joshtronic.com/2016/02/14/how-to-capitalize-the-first-letter-in-a-string-in-javascript/
