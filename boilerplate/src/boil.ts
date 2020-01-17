import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import Handlebars from "handlebars";

Handlebars.registerHelper("lower", (str: string) => str.toLowerCase());

type TemplateFunctionMap = Map<string, HandlebarsTemplateDelegate>;

const templates: TemplateFunctionMap = new Map();

for (const fileName of readdirSync(join(__dirname, "../templates"))) {
  if (fileName.endsWith(".hbs")) {
    const key = fileName.replace(/\..*/, "");
    const template = readFileSync(
      join(__dirname, "../templates", fileName),
      "utf-8"
    );
    const templateFunction = Handlebars.compile(template);
    templates.set(key, templateFunction);
  }
}

templates.forEach((templateFunction, key) => {
  console.log("PROCESSING", key);
  try {
    console.log(templateFunction({ name: "Entry" }));
  } catch (error) {
    console.log("ERROR", error);
  }
});
