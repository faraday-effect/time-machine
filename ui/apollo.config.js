// Configure Apollo client.

module.exports = {
  client: {
    service: {
      name: "time-machine-client",
      localSchemaFile: "../server/schema.graphql",
    },
  },
};
