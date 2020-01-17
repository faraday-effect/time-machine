const RESOLVER_TEMPLATE = `
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { {{ name }}Service } from "./{{ name|lower }}.service";
import { {{ name }}, {{ name }}CreateInput } from "./entities";

@Resolver("{{ name }}")
export class {{ name }}Resolver {
  constructor(private readonly {{ name|lower }}Service: {{ name }}Service) {}

  @Mutation(() => {{ name }})
  create{{ name }}(@Args("createInput") createInput: {{ name }}CreateInput) {
    return this.{{ name|lower }}Service.create{{ name }}(createInput);
  }

  @Query(() => [{{ name }}])
  read{{ namePlural }}() {
    return this.{{ name|lower }}Service.read{{ namePlural }}();
  }
}
`;