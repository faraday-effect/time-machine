import { readFileSync } from "fs";
import { parse } from "path";
import "reflect-metadata";

import Handlebars from "handlebars";
import figlet from "figlet";
import { ERSchema, loadSchema } from "./er-schema";
import pluralize from "pluralize";
import program from "commander";
import { sync } from "walkdir/walkdir";

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
  for (const path of sync("templates")) {
    if (path.endsWith(".hbs")) {
      const pathInfo = parse(path);
      const key = pathInfo.name.replace(/\..*/, "");
      const template = readFileSync(path, "utf-8");
      const templateFunction = Handlebars.compile(template, {
        noEscape: true
      });
      templateMap.set(key, templateFunction);
    }
  }

  if (program.verbose) {
    banner("templates");
    templateMap.forEach((value, key) => console.log(key));
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

function generateEntity(schema: ERSchema) {
  return renderTemplate("entity", {
    entityName: schema.entity.name,
    ...schema.declareFields()
  });
}

function main(schemaName: string) {
  registerHelpers();
  loadTemplates();

  const schema = loadSchema(schemaName);

  if (program.verbose) {
    banner(schema.inflections.entityLower);
    console.log(JSON.stringify(schema, null, 2));
    banner("inflections");
    console.log(JSON.stringify(schema.inflections, null, 2));
  }

  if (program.entity || program.all) {
    banner("entity");
    console.log(generateEntity(schema));
  }

  if (program.module || program.all) {
    banner("module");
    console.log(
      renderTemplate("module", { entityName: schema.inflections.entityUpper })
    );
  }

  if (program.resolver || program.all) {
    banner("resolver");
    console.log(
      renderTemplate("resolver", {
        entityName: schema.inflections.entityUpper,
        entityNamePlural: schema.inflections.entityUpperPlural
      })
    );
  }

  if (program.service || program.all) {
    banner("service");
    console.log(
      renderTemplate("service", {
        entityName: schema.inflections.entityUpper,
        entityNamePlural: schema.inflections.entityUpperPlural
      })
    );
  }

  banner("table");
  console.log(renderTemplate("table", schema.inflections));

  banner("create-update");
  console.log(renderTemplate("create-update", schema.inflections));

  banner("crud");
  console.log(renderTemplate("crud", schema.inflections));
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
