import { AuthHandler, GoogleAdapter, LinkAdapter, Session } from "sst/node/auth";
import { sendEmail } from './email/emailService';
import { Config } from "sst/node/config";
import { uuid } from 'uuidv4';

// import { SvelteKitSite as Site } from "sst/node/site";
import { createNewUser, getUserByEmail } from '../../core/src/users';

declare module 'sst/node/auth' {
	export interface SessionTypes {
		user: {
			userId: string;
		};
	}
}

const getSessionParameter = (userId: string) => {
    console.log('onSucess -- getSessionParameter', userId);

    const sessionParam = Session.parameter({
        type: 'user',
        properties: {
            userId: userId
        },
        options: {
            expiresIn: 60 * 60 * 24 , // 1 day
        },

        // rdirect to the / page without any query string
        // redirect: `${Config.SITE_URL}/`
        redirect: `${Config.SITE_URL}/provider`
    });
    console.log('onSucess -- getSessionParameter', `redirecting...${Config.SITE_URL}/provider`);
    return sessionParam;
};

export const handler = AuthHandler({
    providers: {
        google: GoogleAdapter({
        mode: "oidc",
        clientID:  Config.GOOGLE_CLIENT_ID,
        // maybe future auth has this
        // prompt: 'select_account',
        onSuccess: async (tokenset) => {
            const claims = tokenset.claims();
            const existingUser = await getUserByEmail(claims.email as string);

            if (existingUser) {
                return getSessionParameter(existingUser.id || '');
            }

            const newUser = await createNewUser(
                claims.sub,
                claims.email as string,
                claims.picture,
                claims.given_name,
                claims.family_name
            );
            
            return getSessionParameter(newUser.id||'');
             
        },
    
    }),
        link: LinkAdapter({
            onLink: async (link, claims) => {
                // use AWS SES to send an email to the user with the link
                // the link should be a URL with a JWT token in the query string
                // await sendEmail(claims.email, link); 
                // replace 'recipient@example.com' with the recipient's email address
                console.log('claims', claims.email);
                const appName = process.env.VITE_APP_NAME;
                const recipient = claims.email as string;
                const sender = process.env.VITE_APP_ADMIN_USER_EMAIL || '';
                const subject = `Login Link from ${appName}`;
                const textBody = `Hello ${claims.email.split('@')[0]},\n\nHere is your login link: ${link}\n\nPlease use it right away\n\nThanks,\nPathway Analytics}`;
                const htmlBody = ` 
                <h1>Hello ${claims.email.split('@')[0]},</h1> 
                <p>Here is your login link: <a href="${link}">Login</a></p> 
                <p>Please use it right away</p> 
                <p>Thanks,</p> 
                <p>${appName}</p> 
                `;
                sendEmail(recipient, sender, subject, textBody, htmlBody)
                .then(data => console.log('Email sent successfully', data))
                .catch(error => console.error('Failed to send email', error));

                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Link sent successfully" }),
                };
            },
            onSuccess: async (tokenset) => {
                const claims = tokenset
                const existingUser = await getUserByEmail(claims.email as string);

                if (existingUser) {
                    return getSessionParameter(existingUser.id || '');
                }
                
                const newUser = await createNewUser(
                    uuid(),
                    claims.email as string,
                    claims.picture,
                    claims.given_name,
                    claims.family_name
                );

                return getSessionParameter(newUser.id || '');
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

