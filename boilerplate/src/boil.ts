import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import "reflect-metadata";

import Handlebars from "handlebars";
import figlet from "figlet";
import { ERSchema } from "./er-schema";
import pluralize from "pluralize";
import program from "commander";
import { plainToClass } from "class-transformer";

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
  const plainObject = JSON.parse(
    readFileSync(join(__dirname, "..", name), "utf-8")
  );
  return plainToClass(ERSchema, plainObject);
}

function generateEntity(schema: ERSchema) {
  return renderTemplate("entity", {
    entityName: schema.entity.name,
    ...schema.declareFields()
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
