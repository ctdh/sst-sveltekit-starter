// We are using the callback pattern here
// rather than on the Frontend app as it is easier to set secure cookies 
// setting secure cookies in a dev environment from localhost is a pain
// we also have more direct access to the session token and User class here 
// which will not require another http request / response cycle
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ApiHandler } from 'sst/node/api';
import { User } from '../../core/user';
import type { SessionTypes } from 'sst/node/auth';
import { Config } from 'sst/node/config'
import { jwtDecode } from 'jwt-decode';

export const main = ApiHandler(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    // console.log('---*** callback.server.ts event.queryStringParameters: ', event.queryStringParameters);
    const sessionToken: string = event.queryStringParameters?.token || '';
    // console.log('---*** callback.server.ts sessionToken: ', sessionToken);
    const decodedToken: SessionTypes['user'] = jwtDecode(sessionToken);
    // console.log('---*** callback.server.ts decodedToken: ', decodedToken);
    const userId = decodedToken?.properties?.userId || '';
    const sessionType = decodedToken?.type || '';

const iatDate = new Date((decodedToken.iat * 1000)+(1000*60*10)); // Convert to milliseconds

// const day = String(iatDate.getDate()).padStart(2, '0');
// const month = String(iatDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
// const year = iatDate.getFullYear();

// const hours = String(iatDate.getHours()).padStart(2, '0');
// const minutes = String(iatDate.getMinutes()).padStart(2, '0');
// const seconds = String(iatDate.getSeconds()).padStart(2, '0');

// const formattedIat = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

// console.log('---*** callback.server.ts iat: ', formattedIat);
// console.log('---*** callback.server.ts iat: ', decodedToken.iat );
// console.log('---*** callback.server.ts exp: ', decodedToken.iat + (60 * 10) );
//     console.log('---*** callback.server.ts now: ', Date.now()/1000); // in seconds
//     console.log('---*** callback.server.ts decodedToken.iat + (60000*1000) < Date.now(): ', decodedToken.iat + (60000*1000) < Date.now());
        
	if (!event.queryStringParameters?.token) {
        console.log('event.queryStringParameters?.token: ', event.queryStringParameters?.token);
        return {
			statusCode: 400,
            headers: {
                'Location': '/login'
            },
			body: 'Badly formed request'
		};
	} else if ( !sessionType || sessionType === 'public' ) {
        // if no sessionType or sessionType is public then redirect to login
		console.log(' --/functions/src/users/callback.ts API handler session.type: ' + sessionType);
		return {
			statusCode: 401,
            headers: {
                'Location': '/login'
            },
			body: 'Unauthorized user session type'
		};

    } else if (Date.now()/1000 > decodedToken.iat + (60 * 1000) ) {
        // convert Date.now() to seconds and compare to iat plus 10 mins
        // the token issued is good for 24 hrs but we do not want to allow the callbck to be used more 
        // than 10 mins after it was issued...
        // check to see if the token is expired (now() < iat plus 10mins)
        // if it is expired then redirect to login

		console.log(' --/functions/src/users/callback.ts API handler session.iat expired: ' + decodedToken.iat + 600000 );
		return {
			statusCode: 401,
            headers: {
                'Location': '/login'
            },
			body: 'Unauthorized user session token expired'
		};
    } else  {
    // if necessary, we can parse by sessionType here...
    // } else if (sessionType === 'user' ) {
    // if sessionType is user then get the user and set the cookies

    // Get the user by id
        const userResponse = await User.getByIdOrEmail(userId);        
        if (!userResponse) {
            console.log(' --/functions/src/users/callback.ts API handler userId not recognised: ' + userId);
            return {
                statusCode: 403,
                headers: {
                    'Location': '/login'
                },
                body: 'Unauthorized user id'
            };   
        } else {
            const domain = Config.STAGE === 'prod' ? '.pathwayanalytics.com' : '';
            const secure = Config.STAGE === 'prod' ? 'Secure;' : '';
            // set the session token, roles and user data in a cookie
            console.log(' --/functions/src/users/callback.ts API handler userResponse: ' + JSON.stringify(userResponse));
            console.log('redirect to Location: ', `${process.env.SITE_URL}/`)
            console.log('api domain: ', `${process.env.API_URL}/`)
            //Domain= api.com; SameSite=None; Secure; HttpOnly
            const roles = userResponse.roles || '';
//            const sessionTokenCookie = `sessionToken=${sessionToken}; Path=/;  ` // + (Config.STAGE === 'prod' ? 'Secure;' : '');
            // const roleCookie = `roles=${roles}; Path=/; ;` 
            // const userIdCookie = `userId=${userResponse.id};Path=/;` 
            const sessionTokenCookie = `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Domain=${domain}; ${secure};` // + (Config.STAGE === 'prod' ? 'Secure;' : '
            // const roleCookie = `roles=${roles}; Path=/; HttpOnly; SameSite=Lax; Secure;` 
            // const userIdCookie = `userId=${userResponse.id}; Path=/; HttpOnly; SameSite=Lax; Secure;` 
            console.log('Set-Cookie: ', `${sessionTokenCookie}`) //, ${roleCookie}, ${userIdCookie}`);
            // in the response it is vital the redirect happens AFTER the cookie is set
            return {
                headers: {
                    'Set-Cookie': `${sessionTokenCookie}`,
                    'Location': `/users/${userResponse.id}`,
                    'Authorization': `Bearer ${sessionToken}`,
                },
                statusCode: 302,
                
            };
        };
	};
});