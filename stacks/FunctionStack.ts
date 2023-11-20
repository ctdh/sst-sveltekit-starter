import {Function, StackContext } from 'sst/constructs';
import * as iam from "aws-cdk-lib/aws-iam";

export function FunctionStack({ stack, app }: StackContext) {

    // so f_SES can send emails
    const sesPolicy = new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
    });

    const f_SES: Function = new Function(stack, "Function", {
        handler: "src/email/lambda.handler",
    });

    f_SES.attachPermissions([sesPolicy as any]);

    return {
        f_SES,
        role_SES: f_SES.role,
    };
}
