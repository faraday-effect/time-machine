import { config } from "dotenv";
config();

import { NestContainer, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { inspect } from "util";
import { AccountService } from "./account/account.service";
import { getConnection } from "typeorm";
import { ProjectService } from "./project/project.service";
import { writeFileSync } from "fs";

type Dictionary = { [key: string]: string };

class DotNode {
  constructor(private label: string, private attributes: Dictionary = {}) {}

  toString() {
    const segments = [this.label];
    const kvPairs = Object.entries(this.attributes).map(
      ([key, value]) => `${key}=${value}`
    );
    if (kvPairs.length > 0) {
      segments.push(`[${kvPairs.join("; ")}]`);
    }
    return `${segments.join(" ")};`;
  }
}

class DotEdge {
  constructor(private lhs: string, private rhs: string) {}

  equals(lhs: string, rhs: string) {
    return this.lhs === lhs && this.rhs === rhs;
  }

  toString() {
    return `${this.lhs} -> ${this.rhs};`;
  }
}

enum GraphType {
  TOP_LEVEL = "digraph",
  SUB_GRAPH = "subgraph",
}

abstract class AbstractGraph {
  protected nodes: DotNode[] = [];
  protected edges: DotEdge[] = [];
  protected subGraphs: AbstractGraph[] = [];

  constructor(private name: string, private type: GraphType) {}

  haveNode(lhs: string, rhs: string) {
    return this.edges.some((node) => node.equals(lhs, rhs));
  }

  addNode(label: string, attributes?: Dictionary) {
    this.nodes.push(new DotNode(label, attributes));
  }

  addEdge(lhs: string, rhs: string) {
    if (!this.haveNode(lhs, rhs)) {
      this.edges.push(new DotEdge(lhs, rhs));
    }
  }

  addSubGraph(subGraph: AbstractGraph) {
    this.subGraphs.push(subGraph);
  }

  toString() {
    const segments = [];

    switch (this.type) {
      case GraphType.TOP_LEVEL:
        segments.push(`${this.type} ${this.name} {`);
        segments.push("rankdir=LR;");
        segments.push("ranksep=2.0;");
        break;
      case GraphType.SUB_GRAPH:
        segments.push(`${this.type} cluster${this.name} {`);
        segments.push(`label="${this.name}";`);
        break;
    }

    for (const node of this.nodes) {
      segments.push(node.toString());
    }

    for (const edge of this.edges) {
      segments.push(edge.toString());
    }

    for (const subGraph of this.subGraphs) {
      segments.push(subGraph.toString());
    }
    segments.push("}");
    return segments.join("\n");
  }
}

class DotGraph extends AbstractGraph {
  constructor(name: string) {
    super(name, GraphType.TOP_LEVEL);
  }

  save(fileName: string) {
    writeFileSync(fileName, this.toString());
  }
}

class DotSubGraph extends AbstractGraph {
  constructor(name: string) {
    super(name, GraphType.SUB_GRAPH);
  }
}

const dotGraph = new DotGraph("modules");

function banner(message: string) {
  console.log();
  console.log("_".repeat(10), message, "_".repeat(10));
}

function showContent(
  moduleName: string,
  contentType: ContentType,
  collection: Set<any> | Map<string, any>
) {
  console.log(contentType);
  console.group();

  let providerSubGraph: DotSubGraph = null;
  for (let item of collection.values()) {
    const className = item.constructor.name;
    let unwrappedName = "[UNKNOWN]";

    switch (className) {
      case "InstanceWrapper":
        unwrappedName = item.name;
        console.log(`InstanceWrapper(name=${unwrappedName})`);
        break;
      case "Module":
        unwrappedName = item._metatype.name;
        console.log(`Module(_metatype=${unwrappedName})`);
        break;
      case "String":
        unwrappedName = item;
        console.log(unwrappedName);
        break;
      default:
        console.log("OTHER", inspect(item, { depth: 1 }));
        throw Error(`Not sure what to do with ${collection}`);
    }

    if (unwrappedName !== "InternalCoreModule") {
      switch (contentType) {
        case ContentType.PROVIDERS:
        case ContentType.CONTROLLERS:
          if (providerSubGraph === null) {
            providerSubGraph = new DotSubGraph(moduleName);
            dotGraph.addSubGraph(providerSubGraph);
          }
          providerSubGraph.addNode(unwrappedName, {
            color: contentType === ContentType.CONTROLLERS ? "blue" : "red",
          });
          break;
        case ContentType.IMPORTS:
          dotGraph.addEdge(moduleName, unwrappedName);
          break;
        case ContentType.EXPORTS:
          // dotGraph.addEdge(unwrappedName, moduleName);
          // dotGraph.addNode(unwrappedName + "FOO", { color: "green" });
          break;
        default:
          break;
      }
    }
  }
  console.groupEnd();
}

enum ContentType {
  PROVIDERS = "Providers",
  MIDDLEWARES = "Middlewares",
  IMPORTS = "Imports",
  INJECTABLES = "Injectables",
  CONTROLLERS = "Controllers",
  EXPORTS = "Exports",
}

function showModules(container: NestContainer) {
  const modules = container.getModules().values();
  for (let module of modules) {
    const moduleName = module.metatype.name;
    banner(`Module ${moduleName} (${module.id})`);

    if (
      [
        "GraphQLModule",
        "GraphQLSchemaBuilderModule",
        "InternalCoreModule",
        "TypeOrmCoreModule",
      ].includes(moduleName)
    ) {
      console.warn("Skipping");
      continue;
    }

    showContent(moduleName, ContentType.PROVIDERS, module.providers);
    showContent(moduleName, ContentType.MIDDLEWARES, module.middlewares);
    showContent(moduleName, ContentType.IMPORTS, module.imports);
    showContent(moduleName, ContentType.INJECTABLES, module.injectables);
    showContent(moduleName, ContentType.CONTROLLERS, module.controllers);
    showContent(moduleName, ContentType.EXPORTS, module.exports);
  }

  dotGraph.save("foo-graph.dot");
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const container = (app as any).container as NestContainer;

  showModules(container);

  const accountService = app.get(AccountService);
  const projectService = app.get(ProjectService);

  const connection = getConnection();
  for (let meta of connection.entityMetadatas) {
    banner(`ENTITY ${meta.name}`);
    for (let column of meta.columns) {
      console.log("\tCOLUMN", column.databaseName, `TYPE ${column.type}`);
    }
  }

  await app.close();
}
bootstrap();

// Credit:
// - https://github.com/jmcdo29/nestjs-spelunker
