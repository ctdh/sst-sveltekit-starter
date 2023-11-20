import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { FunctionStack } from "./stacks/FunctionStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { AuthStack } from "./stacks/AuthStack";

export default {
  config(_input) {
    return {
      name: "template",
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
    .stack(ApiStack)
    .stack(FunctionStack)
    .stack(FrontendStack)
    .stack(AuthStack)
  },
} satisfies SSTConfig;