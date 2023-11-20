import { StackContext, SvelteKitSite, use, Config } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { StorageStack } from "./StorageStack";

export function FrontendStack({ stack, app }: StackContext) {
    const { api } = use(ApiStack);
    const { bucket } = use(StorageStack);
  
    // Define our React app
    const site: SvelteKitSite = new SvelteKitSite(stack, "SvelteSite", {
        path: "packages/frontend",
            
        // Pass in our environment variables
        environment: {
            VITE_APP_STAGE: app.stage,
            VITE_APP_API_URL: api.url,
            VITE_APP_REGION: app.region,
            VITE_APP_BUCKET: bucket.bucketName,
            VITE_APP_MODE: app.stage,

            VITE_APP_NAME: process.env.APP_NAME || '',
            VITE_APP_SELF_REG: process.env.SELF_REG || 'false',
            VITE_APP_FIRST_USER_ROLE: process.env.FIRST_USER_ROLE || '',
            VITE_APP_FIRST_USER_EMAIL: process.env.FIRST_USER_EMAIL || '',
            // TODO: VITE_APP_MANUAL_REG: process.env.MANUAL_REG || 'false',
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
        "PUBLIC_SITE_URL": site_url 
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