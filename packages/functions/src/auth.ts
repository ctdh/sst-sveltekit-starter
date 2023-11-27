import { AuthHandler, GoogleAdapter, LinkAdapter, Session, SessionTypes } from 'sst/node/auth';
import { sendEmail } from './email/emailService';
import { Config } from "sst/node/config";
import { uuid } from 'uuidv4';
import { User, Role} from "../../core/user";

// we have also created an extend SessionTypes interface in the $shared_types folder
declare module 'sst/node/auth' {
    export interface SessionTypes {
        user: {
            type: string;
            properties: {
                userId: string;
            };
            options: {  // These are a set of predefined claims which are not mandatory but recommended, to provide a set of useful, interoperable claims. 
                //  algorithm?: Algorithm  // algorithm used to sign the token
                // mutatePayload?: boolean //
                // expiresIn?: number | string  // expires at epoch time
                // notBefore?: number // not valid before epoch time
                // jti?: string  // unique identifier for the token
                // aud?: string | string[]  // audience
                // iss?: string  // issued by a URI representing the issuer
                // sub?: string  // subject
                // nonce?: string // number used once
                // kid?: string // key id
                // header?: JwtHeader 
                // noTimestamp?: boolean  // if true, do not validate the expiration of the token
                // clockTimestamp?: number  // epoch time now in seconds
            };
            iat: number;
            exp: number;
        };
        api_connection?: {
            api_key: string;
        };
    }
}
// export the extended SessionTypes interface
export type {SessionTypes};

export const handler = AuthHandler({
    providers: {
        google: GoogleAdapter({
        mode: "oidc",
        clientID:  Config.GOOGLE_CLIENT_ID,
        // maybe future auth has this
        // prompt: 'select_account',

        onSuccess: async (tokenset) => {
            const claims = tokenset;
            const authUser = await handleClaim(claims);
            if(authUser) {
                const params = getSessionParameter(authUser.id || '');
                return Session.parameter(params);
            } else {
                return {
                    statusCode: 403,
                    body: JSON.stringify({ 'Authentication Error': "Credentials not valid" }),
                };
            }
        }
    
    }),
        link: LinkAdapter({

            onLink: async (link, claims) => {
                const email = await composeEmail(claims.email, link);
                const sentEmail = await sendEmail(email.recipient, email.sender, email.subject, email.textBody, email.htmlBody);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Link sent successfully" }),
                };
            },

            onSuccess: async (tokenset) => {
                console.log('onSuccess -- tokenset', tokenset);
                const claims: Record<string, any> = tokenset;
                console.log('onSuccess -- claims', claims);
                const authUser: User | undefined = await handleClaim(claims);
                // take the authUser.id and return a session parameter
                console.log('onSuccess -- authUser', authUser);
                if (authUser?.id !== undefined) {
                    console.log('onSuccess -- authUser.id gettingSessParams authUser.id', authUser.id);
                    const params = getSessionParameter(authUser.id || '');
                    console.log('onSuccess -- authUser.id gettingSessParams params', params);
                    return Session.parameter(params);
                } else {
                    return {
                        statusCode: 403,
                        body: JSON.stringify({ 'Authentication Error': "Credentials not valid" }),
                    };
                }
            },
            
            onError: async () => {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ 'Link message': "An error occurred" }),
                };
            },
        }),
    }
});

function getSessionParameter (userId: string)
:{
    type: keyof SessionTypes;
    properties: {
        userId: string;
    };
    options: {
        // expiresIn: number;
        // iat?: number;
        // exp?: number;
    };
    redirect: string;
} 
{
    return {
        type: 'user' as keyof SessionTypes,
        properties: {
            userId: userId,
        },
        options: {
            // expiresIn: 60 * 60 * 24 * 1000, // 1 day
        },
        // redirect to callback where there is a server side endpoint to set the cookie
        // /callback then sets localstorage and redirects to the authorised pages
        redirect: `${Config.SITE_URL}/`
    };
}

// function to take the claim onSuccess and 
// if claims.email matches ADMIN_USER_EMAIL
//   the createUpdate a new user with ADMIN_USER_ROLE
// else if SELF_REG then create a new user
// else if user exists then return user
// else ignore
async function handleClaim(claims:Record<string,any>): Promise<User | undefined> {

    console.log('---*** auth.ts handleClaim claims', claims);
    const adminEmail:string = Config.ADMIN_USER_EMAIL || '';
    const selfReg:boolean = Boolean(Config.SELF_REG) || false;

    // is adminEmail === claims.email
    if (adminEmail === claims.email) {
        const newUser: User = {
            id: uuid(),
            email: claims.email as string,
            picture: claims.picture,
            firstName: claims.given_name,
            lastName: claims.family_name,
            roles: Role.ADMIN
        };
        console.log('---*** auth.ts createUpdate(newUser) Admin User: ', newUser);
        const createUser = User.createUpdate(newUser);
        return newUser;
    } else if ( selfReg ) {
        const existingUser = await User.getByIdOrEmail(claims.email as string);
        if (!existingUser) {
            const newUser: User = {
                id: uuid(),
                email: claims.email as string,
                picture: claims.picture,
                firstName: claims.given_name,
                lastName: claims.family_name,
                roles: ''
            };
            console.log('---*** auth.ts createUpdate(newUser) : ', newUser);
            const createUser = User.createUpdate(newUser);
            return newUser;
        } else {
            return existingUser;
        }
    } else {
        const existingUser = await User.getByIdOrEmail(claims.email as string);
        if (!existingUser) {
            console.log('---*** auth.ts handleClaim error user not found', existingUser);
            return existingUser;
        } else {
            return existingUser;
        }
    }
}

function composeEmail(email: string, link: string)
: Promise<{
recipient: string, 
sender: string, 
subject: string, 
textBody: string,
htmlBody: string
}> {
    // use AWS SES to send an email to the user with the link
    // the link should be a URL with a JWT token in the query string
    // await sendEmail(claims.email, link); 
    // replace '
    console.log('claims', email);
    const appName = Config.APP_NAME;
    console.log('appName', appName);
    const recipient: string = email as string;
    const sender = Config.ADMIN_USER_EMAIL || '';
    console.log('sender', sender);
    const subject = `Login Link from ${appName}`;
    const textBody = `Hello ${email.split('@')[0]},\n\nHere is your login link: ${link}\n\nPlease use it right away\n\nThanks,\nPathway Analytics}`;
    const htmlBody = ` 
    <h1>Hello ${email.split('@')[0]},</h1> 
    <p>Here is your login link: <a href="${link}">Login</a></p> 
    <p>Please use it right away</p> 
    <p>Thanks,</p> 
    <p>${appName}</p> 
    `;
    return Promise.resolve({
        recipient: recipient, 
        sender: sender, 
        subject: subject, 
        textBody: textBody, 
        htmlBody: htmlBody
    });
}