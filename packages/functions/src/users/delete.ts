import { ApiHandler } from 'sst/node/api';
// import { useSession } from 'sst/node/auth';
// import { getByIDOrEmail } from '../../../core/users';

export const handler = ApiHandler(async () => {
// returns user info of userid 
// TODO:
// get user from session
// unless user.role === 'admin' then 
// get user from db by id is user.id === session.userid

    return {
		statusCode: 200,
		body: JSON.stringify({ 
		 })
	};
});