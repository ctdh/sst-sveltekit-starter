import { Bucket, StackContext, Table, RDS } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  // Create an S3 bucket with proper cors access
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

    // Create the Aurora DB cluster
    const DATABASE = "MY_DB";
    const cluster = new RDS(stack, "Cluster", {
      engine: "postgresql13.9",
      defaultDatabaseName: DATABASE,
      scaling: {
        // autopause: true if stage is not prod
        autoPause: stack.stage !== "prod",
        // maxCapacity if not prod set to "ACU_1" else set to "ACU_2",
        maxCapacity: stack.stage == "prod" ? "ACU_4" : "ACU_2",
        minCapacity:  "ACU_2",
      },
      migrations: "packages/functions/migrations",
    });

  // Create the DynamoDB tables, Notes and Users
  const table = new Table(stack, "Users", {
    fields: {
      userId: "string",
      keyId: "string",
    },
    primaryIndex: { 
        partitionKey: "userId", 
        sortKey: "keyId" 
    },
  });  

  return {
    bucket,
    table,
    cluster,
  };
}