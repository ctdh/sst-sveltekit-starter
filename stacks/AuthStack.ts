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
            bind: [
                site,
                new Config.Secret(stack, "GOOGLE_CLIENT_ID"),
                new Config.Parameter(stack, "REGION", {
                    value: stack.region
                }),
                new Config.Parameter(stack, "SITE_URL", {
                    value: site_url 
                }),
                new Config.Parameter(stack, "API_URL", {
                    value: api.url ?? ''
                })
            ],
        },
    });
    
    //pnpm sst secrets set GOOGLE_CLIENT_ID <YOUR GOOGLE_CLIENT_ID>
    auth.attach(stack, {
        api,
        prefix: "/auth", // optional
      });
    return {
        auth
    }
}