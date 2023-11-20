import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
import { User } from '@types/users';
import { updateUserByID } from '../../../core/src/users';

type Request = {
    body: User;
};

// takes a POST request with a userInfo:Users object
// returns userInfo:Users object
export const handler = ApiHandler(async (req: <body: Users>) => {
    const session = await useSession();
    if (!session) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }
    const user = await updateUserByID(req.body);
    return {
        statusCode: 200,
        body: JSON.stringify({ user })
    };
}

// export const handler = ApiHandler(async () => {
    // takes a POST request with user info
    // returns user info of userid 
    
// get user from session
// unless user.role === 'admin' then 
// get user from db by id is user.id === session.userid

    return {
		statusCode: 200,
		body: JSON.stringify({ 
		 })
	};
});