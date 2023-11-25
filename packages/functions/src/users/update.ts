import { ApiHandler } from 'sst/node/api';
import type { User } from '../../../types';
import { updateUserByID } from '../../../core/src/users';

type Request = {
    body: User;
};

// takes a POST request with a userInfo:Users object
// returns userInfo:Users object
export const main = ApiHandler(async (_evt) => {

    const data = JSON.parse(_evt.body || "{}");

    const res = await updateUserByID(data);

    console.log('getUserByID res:' + JSON.stringify(res));
    return {
		statusCode: 200,
		body: JSON.stringify({ 
			res
		 })
	};
});

// export const handler = ApiHandler(async () => {
    // takes a POST request with user info
    // returns user info of userid 
    
// get user from session
// unless user.role === 'admin' then 
// get user from db by id is user.id === session.userid

;