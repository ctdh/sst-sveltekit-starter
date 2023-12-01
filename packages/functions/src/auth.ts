import { AuthHandler, GoogleAdapter, LinkAdapter, Session, SessionTypes } from 'sst/node/auth';
import { sendEmail } from './email/emailService';
import { Config } from "sst/node/config";
import { uuid } from 'uuidv4';
import { User, Role, type User as UserType} from "../../core/user";

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
                const cookies = getSessionCookies(authUser.id || '');
                // return Session.parameter(params);
                return Session.cookie(cookies);
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
                // swap out the domain in the link for the api domain so we hide the aws api gateway url
                // we need to do this for secure cookies to work
                link = link.replace(Config.AWS_API_URL, Config.API_URL);
                const email = await composeEmail(claims.email, link);
                const sentEmail = await sendEmail(email.recipient, email.sender, email.subject, email.textBody, email.htmlBody);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Link sent successfully" }),
                };
            },

            onSuccess: async (tokenset) => {
                console.log('1. onSuccess -- tokenset', tokenset);
                const claims: Record<string, any> = tokenset;
                console.log('2. onSuccess -- claims', claims);
                const authUser: User | undefined = await handleClaim(claims);
                // take the authUser.id and return a session parameter
                console.log('3. onSuccess -- authUser', authUser);
                if (authUser?.id !== undefined) {
                    console.log('4. onSuccess -- authUser.id gettingSessParams authUser.id', authUser.id);
                    const params = getSessionParameter(authUser.id || '');
                    const cookies = getSessionCookies(authUser.id || '');
                    console.log('5. onSuccess -- authUser.id gettingCookies', cookies);
                    // decide whether to use cookies or params for session management 
                    // https://docs.sst.dev/auth#cookies
                    // if using cookie: set cors, requests must use 'include' for credentials
                    return Session.cookie(cookies);
                    // return Session.parameter(params);
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

function getSessionCookies (userId: string):{
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
}{
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
        redirect: `${Config.SITE_URL}/admin/users`
    };
}

function getSessionParameter (userId: string):{
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
        redirect: `${Config.API_URL}/callback`
    };
}

// function to take the claim onSuccess and 
// if claims.email matches ADMIN_USER_EMAIL
//   the createUpdate a new user with ADMIN_USER_ROLE
// else if SELF_REG then create a new user
// else if user exists then return user
// else ignore
async function handleClaim(claims:Record<string,any>): Promise<User | undefined> {

    console.log('6. ---*** auth.ts handleClaim claims', claims);
    const adminEmail:string = Config.ADMIN_USER_EMAIL || '';
    const selfReg:boolean = Boolean(Config.SELF_REG) || false;

    if (claims.email){
        const existingUser: UserType = await User.getByIdOrEmail(claims.email) 
        // is this an admin user?
        if (adminEmail === claims.email) {
            // check if user exists
            console.log('7. ---*** auth.ts createUpdate(newUser) Admin User: ', claims.email);
            if (existingUser.id) {
                console.log('7a. ---*** auth.ts existing User: ', JSON.stringify(existingUser));
                // Check if user has ADMIN role
                // Convert roles CSV string to array
                let roles = existingUser.roles ? existingUser.roles.split(',') : [];
                // Add 'ADMIN' to roles array if it's not already there
                if (!roles.includes('ADMIN')) {
                    console.log('7b. ---*** auth.ts check roles : ', existingUser.roles);
                    roles.push('ADMIN');
                    // Convert roles array back to CSV string
                    existingUser.roles = roles.join(',');
                    return await User.createUpdate(existingUser);
                } else {
                    console.log('8. ---*** auth.ts createUpdate(newUser) Admin User already has ADMIN role: ', claims.email);
                    return existingUser;
                }
            } else {
                // add new user with ADMIN role
                console.log('9. ---*** auth.ts createUpdate(newUser) create new Admin user: ', claims.email);
                const newUser: UserType = {
                    id: uuid(),
                    email: claims.email as string,
                    picture: claims.picture,
                    firstName: claims.given_name,
                    lastName: claims.family_name,
                    roles: Role.ADMIN
                };
                return await User.createUpdate(newUser);
            }
        // is Self-reg enabled?
        } else if ( selfReg ) {

            if (existingUser.id) {
                return existingUser;
            } else {
                const newUser: User = {
                    id: uuid(),
                    email: claims.email as string,
                    picture: claims.picture,
                    firstName: claims.given_name,
                    lastName: claims.family_name,
                    roles: ''
                };
                console.log('10. ---*** auth.ts createUpdate(newUser) : ', newUser);
                return await User.createUpdate(newUser);
            }
        // Does the user exist already?
        } else {
            if (!existingUser) {
                console.log('11. ---*** auth.ts handleClaim error user not found', existingUser);
            } 
            return existingUser;
        }
    } else {
        console.log('12. ---*** auth.ts handleClaim error claims.email not found', claims);
        return undefined;
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
    console.log('13. claims', email);
    const appName = Config.APP_NAME;
    console.log('14. appName', appName);
    const recipient: string = email as string;
    const sender = Config.ADMIN_USER_EMAIL || '';
    console.log('15. sender', sender);
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