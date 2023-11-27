import { StackContext, Auth, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { FrontendStack } from "./FrontendStack";
import { Config} from "sst/constructs";
import { FunctionStack } from "./FunctionStack";

export function AuthStack({ stack }: StackContext) {
    const { site, site_url } = use(FrontendStack);
    const { api } = use(ApiStack);
    const { role_SES } = use(FunctionStack);
 
    const auth: Auth = new Auth(stack, "Auth", {
        authenticator:{
            handler: "packages/functions/src/auth.handler",
            role: role_SES as any,
            bind: ([
                // site,
                // // pnpm sst secrets set GOOGLE_CLIENT_ID <YOUR GOOGLE_CLIENT_ID>
                new Config.Secret (stack, "GOOGLE_CLIENT_ID"),
                new Config.Parameter(stack, "REGION", {
                    value: stack.region
                }),
                new Config.Parameter(stack, "SITE_URL", {
                    value: site_url ?? ''
                }),
                new Config.Parameter(stack, "APP_NAME", {
                    value: process.env.APP_NAME ?? ''
                }),
                new Config.Parameter(stack, "ADMIN_USER_EMAIL", {
                    value: process.env.ADMIN_USER_EMAIL ?? ''
                }),
                new Config.Parameter(stack, "ADMIN_USER_ROLE", {
                    value: process.env.ADMIN_USER_ROLE ?? ''
                }),
                new Config.Parameter(stack, "DOMAIN", {
                    value: process.env.DOMAIN ?? ''
                }),
                new Config.Parameter(stack, "SELF_REG", {
                    value: (process.env.SELF_REG ?? '').toLowerCase()
                })
            ]),
        },
    });
    
    auth.attach(stack, {
        api,
        prefix: "/auth", // optional
      });
    return {
        auth
    }
}