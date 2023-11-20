import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
import * as iam from "aws-cdk-lib/aws-iam";
// import { Role as iam} from "aws-cdk-lib/aws-iam";


export function ApiStack(this: any, { stack }: StackContext) {
 const { table } = use(StorageStack);
 const { cluster } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table, cluster],
      },
      
    },
  
    routes: {
      "GET /session":       {
        authorizer:         "none",
        function: {
          handler:          "packages/functions/src/session/session.handler",
          environment: {
            REGION:          this.region,
          },
        }
      },

      "POST /users":        "packages/functions/src/users/create.main",
      "GET /users/{id}":    "packages/functions/src/users/get.main",
      "GET /users":         "packages/functions/src/users/list.main",
      "PUT /users/{id}":    "packages/functions/src/users/update.main",
      "DELETE /users/{id}": "packages/functions/src/users/delete.main",
      
      "POST /login": {
        authorizer:         "none",
        function: {
          handler:          "packages/functions/src/login.main",
          environment: {
            REGION:          this.region,
          },
        }
      },
      "GET /logout":        "packages/functions/src/logout.main",

    },
  });

  // Show the API endpoint in the output
  // Show the resource info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    SecretArn: cluster.secretArn,
    ResourceArn: cluster.clusterArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  });

  api.attachPermissions([table, cluster]);

  // Return the API resource
  return {
    api,
  };
}