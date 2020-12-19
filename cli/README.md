tm-cli
======

Command-line interface for Faraday Time Machine

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tm-cli.svg)](https://npmjs.org/package/tm-cli)
[![Downloads/week](https://img.shields.io/npm/dw/tm-cli.svg)](https://npmjs.org/package/tm-cli)
[![License](https://img.shields.io/npm/l/tm-cli.svg)](https://github.com/nurkkala/tm-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g tm-cli
$ tm-cli COMMAND
running command...
$ tm-cli (-v|--version|version)
tm-cli/0.0.0 darwin-x64 node-v14.15.3
$ tm-cli --help [COMMAND]
USAGE
  $ tm-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tm-cli hello [FILE]`](#tm-cli-hello-file)
* [`tm-cli help [COMMAND]`](#tm-cli-help-command)
* [`tm-cli password [FILE]`](#tm-cli-password-file)

## `tm-cli hello [FILE]`

describe the command here

```
USAGE
  $ tm-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ tm-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/nurkkala/tm-cli/blob/v0.0.0/src/commands/hello.ts)_

## `tm-cli help [COMMAND]`

display help for tm-cli

```
USAGE
  $ tm-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `tm-cli password [FILE]`

describe the command here

```
USAGE
  $ tm-cli password [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/password.ts](https://github.com/nurkkala/tm-cli/blob/v0.0.0/src/commands/password.ts)_
<!-- commandsstop -->
