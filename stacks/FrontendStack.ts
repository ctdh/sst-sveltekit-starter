import { StackContext, SvelteKitSite, use, Config } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { StorageStack } from "./StorageStack";

export function FrontendStack({ stack, app }: StackContext) {
    const { api } = use(ApiStack);
    const { bucket, cluster } = use(StorageStack);
  
    // Define our React app
    const site: SvelteKitSite = new SvelteKitSite(stack, "SvelteSite", {
        path: "packages/frontend",
            
        // Pass in our environment variables
        environment: {
            // NO Secrets in here.... (see AuthStack for secrets)
            // clientSide: import { env } from '$env/dynamic/private';
            // clientSide: import { env } from '$env/dynamic/public';
            // const apiUrl = env.VITE_APP_API_URL;
            PUBLIC_STAGE: app.stage,
            PUBLIC_API_URL: api.url,
            PUBLIC_REGION: app.region,
            PUBLIC_BUCKET: bucket.bucketName,
            PUBLIC_MODE: app.stage,

            PUBLIC_APP_NAME: process.env.APP_NAME || '',
            PUBLIC_SELF_REG: process.env.SELF_REG?.toLocaleLowerCase() || 'false',
            PUBLIC_ADMIN_USER_ROLE: process.env.ADMIN_USER_ROLE || '',
            PUBLIC_ADMIN_USER_EMAIL: process.env.ADMIN_USER_EMAIL || '',
        },
     
    });
    
    // api.url has correct protocol alread (always https)
    // site.url is actually just the domain and need the protocol added
    const protocol  = app.stage === 'prod' ? 'https://' : 'http://';
    const port      = app.stage === 'prod' ? '' : `:${process.env.PORT}`;
    
    const site_url = app.stage === 'prod'
        ? protocol + site.url + port 
        : protocol + `localhost` + port;

    // set CORS on API Gateway
    api.setCors({
        allowMethods: ["ANY"],  
        allowHeaders: ["*"],  
        allowOrigins: ["*"],
    });

    app.addDefaultFunctionEnv({
        "VITE_APP_SITE_URL": site_url 
      })

    const region = app.region;

    // Show the url in the output
    stack.addOutputs({
        SiteUrl: site_url,
    });
    
    return {
        site,
        region,
        site_url,
    };
}