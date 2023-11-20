import { it } from "vitest";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { StorageStack } from "../StorageStack";
import { Template } from "aws-cdk-lib/assertions";

// This is a very simple CDK test that checks if our 
// storage stack creates a DynamoDB table and that the
//  table’s billing mode is set to PAY_PER_REQUEST. 
// This is the default setting in SST’s Table construct. 
// This test is making sure that we don’t change this 
// setting by mistake.

it("Test StorageStack", async () => {
  await initProject({});
  const app = new App({ mode: "deploy" });
  // WHEN
  app.stack(StorageStack);
  // THEN
  const template = Template.fromStack(getStack(StorageStack));
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
  });
});