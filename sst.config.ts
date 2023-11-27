import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { FunctionStack } from "./stacks/FunctionStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { AuthStack } from "./stacks/AuthStack";

export default {
  config(_input) {
    return {
      name: "sst-svelte-starter",
      region: "us-east-1",
    };
  },
  stacks(app) {
    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app
    .stack(StorageStack)
    .stack(ApiStack) // depends on auth and then attach api (graphql ApiAuthorizer error)
    .stack(FunctionStack) 
    .stack(FrontendStack) //requires api url
    .stack(AuthStack) // requires SES permissions from function stack
  },
} satisfies SSTConfig;