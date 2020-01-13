#!/usr/bin/env python3

import json
import sys

import inflect as inflect
import yaml
from jinja2 import Environment, FileSystemLoader
from jsonschema import validate, ValidationError


def read_yaml(yaml_file_name):
    with open(yaml_file_name, "r") as f:
        return yaml.safe_load(f)


def read_json(json_file_name):
    with open(json_file_name, "r") as f:
        return json.load(f)


def rule(n, char='='):
    return char * n


def banner(string, fat=False):
    string = f"{rule(10)} {string} {rule(10)}"
    if fat:
        r = rule(len(string))
        print("\n".join(['', r, string, r, '']))
    else:
        print("\n" + string + "\n")


schema = read_json("schemata/nest-schema.json")

jinja2_env = Environment(loader=FileSystemLoader("./templates"))
entity_template = jinja2_env.get_template("entity.ts.jinja2")
resolver_template = jinja2_env.get_template("resolver.ts.jinja2")
service_template = jinja2_env.get_template("service.ts.jinja2")

p = inflect.engine()

for file_name in sys.argv[1:]:
    if file_name.endswith(".json"):
        variables = read_json(file_name)
    else:
        variables = read_yaml(file_name)

    if 'namePlural' not in variables:
        variables['namePlural'] = p.plural(variables['name'])

    try:
        validate(variables, schema)
    except ValidationError as err:
        print("Validation failed", err)
        exit(1)

    banner(f"Entity for {file_name}", True)
    print(entity_template.render(variables))

    banner(f"Service for {file_name}", True)
    print(service_template.render(variables))

    banner(f"Resolver for {file_name}", True)
    print(resolver_template.render(variables))
