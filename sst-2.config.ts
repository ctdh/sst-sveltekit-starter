import { 
    StackContext, Config,
    Bucket, Table, RDS,
    Api,
    Function,
    Auth, 
    SvelteKitSite, 
} from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";

export function exmapleStack({stack, app}: StackContext){
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
    
        const DATABASE = "MY_DB";
        const cluster = new RDS(stack, "Cluster", {
          engine: "postgresql13.9",
          defaultDatabaseName: DATABASE,
          scaling: {
            autoPause: stack.stage !== "prod",
            maxCapacity: stack.stage == "prod" ? "ACU_4" : "ACU_2",
            minCapacity:  "ACU_2",
          },
          migrations: "packages/functions/migrations",
        });
    
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

    //   create an api
    const api = new Api(stack, "Api", {
        authorizers: {  
          jwt_auth: {  
            type: "jwt",  
            jwt: {  
              issuer: app.stage === "prod" ? `https://${process.env.DOMAIN}/`: `http://localhost:5173/`,
              audience: [
                app.stage === "prod" ? `https://${process.env.DOMAIN}/`: `http://localhost:5173/`,
                "gq6r4c5n5q2t9j7mD2J5WQY8s9",
              ],  
            },  
          },  
        },  
        defaults: {
        authorizer: 'jwt_auth',
        function: {
          bind: [
            table, 
            cluster],
        },
        },
        routes: {
          "POST /users":        "packages/functions/src/users/create.main",
          "GET /users/{id}":    "packages/functions/src/users/get.main",
          "GET /users":         "packages/functions/src/users/list.main",
          "PUT /users/{id}":    "packages/functions/src/users/update.main",
          "DELETE /users/{id}": "packages/functions/src/users/delete.main",
        },
      });

      stack.addOutputs({
        ApiEndpoint: api.url,
        SecretArn: cluster.secretArn,
        ResourceArn: cluster.clusterArn,
        ClusterIdentifier: cluster.clusterIdentifier,
      });
    
      api.attachPermissions([table, cluster]);
    
    // create a function stack for SES permissions
    let role_SES:any
    const sesPolicy = new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
    });

    const f_SES: Function = new Function(stack, "Function", {
        handler: "src/email/lambda.handler",
    });

    role_SES = f_SES.attachPermissions([sesPolicy as any]);

    // create an auth stack
    const auth: Auth = new Auth(stack, "Auth", {
        authenticator:{
            handler: "packages/functions/src/auth.handler",
            role: role_SES as any,
            bind: ([
                new Config.Secret (stack, "GOOGLE_CLIENT_ID"),
                new Config.Parameter(stack, "REGION", {
                    value: stack.region
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
    
    auth.attach(stack, {api});
    //     api
    //     // api,
    //     // prefix: "/auth", // optional
    //   });

    // create a frontend stack
    const site: SvelteKitSite = new SvelteKitSite(stack, "SvelteSite", {
        path: "packages/frontend",
        bind:[bucket, cluster],
        environment: {
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
    
    const protocol  = app.stage === 'prod' ? 'https://' : 'http://';
    const port      = app.stage === 'prod' ? '' : `:${process.env.PORT}`;
    const site_url = app.stage === 'prod'
        ? protocol + site.url + port 
        : protocol + `localhost` + port;

    app.addDefaultFunctionEnv({
        "PUBLIC_APP_SITE_URL": site_url 
        })

        api.setCors({
        allowMethods: ["ANY"],  
        allowHeaders: ["*"],  
        allowOrigins: ["*"],
    });
    const region = app.region;

    // Show the url in the output
    stack.addOutputs({
        SiteUrl: site_url,
    });
    
    return {
        bucket,
        table,
        cluster,
        api,
        auth,
        site
    };
}