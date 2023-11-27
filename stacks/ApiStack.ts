import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
// first create the authStack then create the apiStack and thn attach it to the authStack
// https://discord.com/channels/983865673656705025/1168593774302208071/1168594348330471506

import * as iam from "aws-cdk-lib/aws-iam";
// import { Role as iam} from "aws-cdk-lib/aws-iam";

export function ApiStack({ stack, app }: StackContext) {
 const { table } = use(StorageStack);
 const { cluster } = use(StorageStack);
 const api_sub_domain =  app.stage === 'prod' ?  `api.${process.env.API_DOMAIN}` : `${app.stage}-api.${process.env.API_DOMAIN}`;
//  const jwt_issuer = `https://${api_sub_domain}/`;

  // Create the API
  const api = new Api(stack, "Api", {
    customDomain: {
      domainName: api_sub_domain,
      hostedZone: process.env.API_DOMAIN,
    },
    // authorizers: {  
    //   jwt_auth: {  
    //     type: "jwt",  
    //     jwt: {
    //       issuer: jwt_issuer,  
    //       audience: [
    //         app.stage === "prod" ? `https://${api_sub_domain}/`: `http://localhost:5173/`,
    //         "gq6r4c5n5q2t9j7mD2J5WQY8s9",
    //       ],  
    //     },  
    //   },  
    // },  
    defaults: {
    authorizer: 'iam',
    function: {
      bind: [
        table, 
        cluster],
    },
    },
    routes: {
      // Example toute with no authorization required
      // "GET /session":       {
      //   authorizer:         "none",
      //   function: {
      //     handler:          "packages/functions/src/session/session.handler",
      //   }
      // },
      "POST /users":        {
        authorizer:         "iam",
        function: {
          handler:          "packages/functions/src/users/create.main"
        }
      },
      "GET /users/{id}":    {
        authorizer:         "iam",
        function: {
          handler:          "packages/functions/src/users/get.main"
        }
      },
      "GET /users":         {
        authorizer:         "iam",
        function: {
          handler:          "packages/functions/src/users/list.main"
        }
      },
      "PUT /users/{id}":    {
        authorizer:         "iam",
        function: {
          handler:          "packages/functions/src/users/update.main"
        }
      },
      "DELETE /users/{id}": 
      {
        authorizer:         "iam",
        function: {
          handler:          "packages/functions/src/users/delete.main"
        }
      },
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