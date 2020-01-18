import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import Handlebars from "handlebars";
import figlet from "figlet";
import { Attribute, ERSchema } from "./er-schema";
import pluralize from "pluralize";
import program from "commander";

type TemplateFunctionMap = Map<string, HandlebarsTemplateDelegate>;

function registerHelpers() {
  Handlebars.registerHelper("lower", (str: string) => str.toLowerCase());
  Handlebars.registerHelper("plural", (str: string) => pluralize(str));
}

function banner(text: string) {
  console.log(figlet.textSync(text));
}

const templateMap: TemplateFunctionMap = new Map();

function loadTemplates() {
  for (const fileName of readdirSync(join(__dirname, "../templates"))) {
    if (fileName.endsWith(".hbs")) {
      const key = fileName.replace(/\..*/, "");
      const template = readFileSync(
        join(__dirname, "../templates", fileName),
        "utf-8"
      );
      const templateFunction = Handlebars.compile(template, {
        noEscape: true
      });
      templateMap.set(key, templateFunction);
    }
  }
}

function renderTemplate(templateKey: string, context: object) {
  const templateFunction = templateMap.get(templateKey);
  if (templateFunction) {
    return templateFunction(context);
  } else {
    throw Error(`No template for key '${templateKey}'`);
  }
}

function loadSchema(name: string) {
  const schema: ERSchema = JSON.parse(
    readFileSync(join(__dirname, "..", name), "utf-8")
  );
  return schema;
}

function gqlField(attr: Attribute, nullable = false) {
  const options = [`description: "${attr.description}"`];
  if (nullable) {
    options.push("nullable: true");
  }
  return `@Field({ ${options.join(", ")} })`;
}

function generateEntity(schema: ERSchema) {
  const objectFields: string[] = [];
  const inputFields: string[] = [];
  const updateFields: string[] = [];

  objectFields.push(
    `@Field(() => Int) @PrimaryGeneratedColumn() ${schema.entity.pk}: number`
  );
  updateFields.push(`@Field(() => Int) ${schema.entity.pk}: number`);

  for (const attr of schema.entity.attributes) {
    switch (attr.type) {
      case "created":
        objectFields.push(
          `${gqlField(attr)} @CreateDateColumn() ${attr.name}: Date`
        );
        inputFields.push(`${gqlField(attr)}  ${attr.name}: Date`);
        break;
      case "updated":
        objectFields.push(
          `${gqlField(attr)} @UpdateDateColumn() ${attr.name}: Date`
        );
        inputFields.push(`${gqlField(attr)}  ${attr.name}: Date`);
        break;
      case "text":
        objectFields.push(
          `${gqlField(attr)} @Column("text") ${attr.name}: string`
        );
        inputFields.push(`${gqlField(attr)}  ${attr.name}: string`);
        updateFields.push(`${gqlField(attr, true)} ${attr.name}: string`);
        break;
      case "string":
      case "boolean":
        objectFields.push(
          `${gqlField(attr)} @Column() ${attr.name}: ${attr.type}`
        );
        inputFields.push(`${gqlField(attr)}  ${attr.name}: ${attr.type}`);
        updateFields.push(`${gqlField(attr, true)} ${attr.name}: ${attr.type}`);
        break;
      default:
        throw Error(`Invalid attribute '${attr}'`);
    }
  }

  for (const rel of schema.relationships) {
    const toLower = rel.to.toLowerCase();
    const entityLower = schema.entity.name.toLowerCase();
    const entityLowerPlural = pluralize(entityLower);

    switch (rel.type) {
      case "oneToMany":
        objectFields.push(
          `@OneToMany(type => ${rel.to}, ${toLower} => ${toLower}.${entityLower}) 
          ${rel.name}: ${rel.to}[]`
        );
        break;
      case "manyToOne":
        objectFields.push(
          `@ManyToOne(type => ${rel.to}, ${toLower} => ${toLower}.${entityLowerPlural})
           ${rel.name}: ${rel.to}`
        );
        break;
      case "manyToMany":
        objectFields.push(
          `@ManyToMany(type => ${rel.to}, ${toLower} => ${toLower}.${entityLowerPlural})
           ${rel.name}: ${rel.to}[]`
        );
        break;
      case "manyToManyOwner":
        objectFields.push(
          `@ManyToMany(type => ${rel.to}, ${toLower} => ${toLower}.${entityLowerPlural})
          @JoinTable()
          ${rel.name}: ${rel.to}[]`
        );
        break;
      default:
        throw Error(`Invalid relationship type '${rel.type}'`);
    }
  }

  return renderTemplate("entity", {
    entityName: schema.entity.name,
    objectFields: objectFields.join(";\n  "),
    inputFields: inputFields.join(";\n  "),
    updateFields: updateFields.join(";\n  ")
  });
}

function pluralSchemaName(schema: ERSchema) {
  let result = schema.entity.namePlural;
  if (!result) {
    result = pluralize(schema.entity.name);
  }
  return result;
}

function main(schemaName: string) {
  registerHelpers();
  loadTemplates();

  const schema = loadSchema(schemaName);
  const entityName = schema.entity.name;
  const entityNamePlural = pluralSchemaName(schema);

  if (program.verbose) {
    banner(entityName);
    console.log(JSON.stringify(schema, null, 2));
  }

  if (program.entity || program.all) {
    banner("entity");
    console.log(generateEntity(schema));
  }

  if (program.module || program.all) {
    banner("module");
    console.log(renderTemplate("module", { entityName }));
  }

  if (program.resolver || program.all) {
    banner("resolver");
    console.log(
      renderTemplate("resolver", {
        entityName,
        entityNamePlural
      })
    );
  }

  if (program.service || program.all) {
    banner("service");
    console.log(
      renderTemplate("service", {
        entityName,
        entityNamePlural
      })
    );
  }
}

program
  .usage("[options] schemaFileName")
  .option("-e --entity", "generate entity")
  .option("-m --module", "generate module")
  .option("-r --resolver", "generate resolver")
  .option("-s --service", "generate service")
  .option("-a --all", "generate all")
  .option("-v --verbose", "be verbose")
  .parse(process.argv);

if (program.args.length === 1) {
  main(program.args[0]);
} else {
  program.help();
}
