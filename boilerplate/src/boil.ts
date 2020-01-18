import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import Handlebars from "handlebars";
import figlet from "figlet";
import { ERSchema } from "./er-schema";
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
        objectFields.push(`@Field() @CreateDateColumn() ${attr.name}: Date`);
        inputFields.push(`@Field() ${attr.name}: Date`);
        break;
      case "updated":
        objectFields.push(`@Field() @UpdateDateColumn() ${attr.name}: Date`);
        inputFields.push(`@Field() ${attr.name}: Date`);
        break;
      case "text":
        objectFields.push(`@Field() @Column("text") ${attr.name}: string`);
        inputFields.push(`@Field() ${attr.name}: string`);
        updateFields.push(`@Field({ nullable: true }) ${attr.name}: string`);
        break;
      case "string":
      case "boolean":
        objectFields.push(`@Field() @Column() ${attr.name}: ${attr.type}`);
        inputFields.push(`@Field() ${attr.name}: ${attr.type}`);
        updateFields.push(
          `@Field({ nullable: true }) ${attr.name}: ${attr.type}`
        );
        break;
      default:
        throw Error(`Invalid attribute '${attr}'`);
    }
  }

  return renderTemplate("entity", {
    name: schema.entity.name,
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
  .option("-a --all", "generate all", true)
  .option("-v --verbose", "be verbose")
  .parse(process.argv);

if (program.args.length === 1) {
  main(program.args[0]);
} else {
  program.help();
}
