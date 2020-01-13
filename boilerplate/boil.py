#!/usr/bin/env python3

import json
import re
import sys

from jinja2 import Environment, FileSystemLoader

import yaml
from jsonschema import validate, ValidationError


def read_yaml(yaml_file_name):
    with open(yaml_file_name, "r") as f:
        return yaml.load(f)


def read_json(json_file_name):
    with open(json_file_name, "r") as f:
        return json.load(f)


def kebab_case(s):
    return s.lower().replace('-', '_')


def snake_case(s):
    return s.lower().replace('-', '_')


def camel_case(s):
    words = re.split('[^A-Za-z0-9]', s)
    first = words[0].lower()
    rest = [word.capitalize() for word in words[1:]]
    return "".join([first] + rest)


def tab(string, n=1):
    print(" " * n * 4, string)


def rule(n, char='='):
    return char * n


def banner(string, fat=False):
    string = f"{rule(10)} {string} {rule(10)}"
    if fat:
        r = rule(len(string))
        print("\n".join(['', r, string, r, '']))
    else:
        print("\n" + string + "\n")


def comment(s):
    print(f"\n# ---- {s}\n")


schema = read_json("schemata/nest-schema.json")

jinja2_env = Environment(loader=FileSystemLoader("./templates"))
template = jinja2_env.get_template("entity.ts.jinja2")

for file_name in sys.argv[1:]:
    if file_name.endswith(".json"):
        variables = read_json(file_name)
    else:
        variables = read_yaml(file_name)

    try:
        validate(variables, schema)
    except ValidationError as err:
        print("Validation failed", err)
        exit(1)

    print(template.render(variables))
