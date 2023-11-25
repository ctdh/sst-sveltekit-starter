import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
// import type { User } from 'shared_types';
import { User, UserFilter } from '../../../core/user';

export const main = ApiHandler(async (event) => {
	console.log(' --/functions/src/users/get.ts API handler');
	// returns user info of userid 

	const session = useSession();
	if (!session.type || session.type !== 'user') {
		return {
			redirect: '/login',
			statusCode: 401,
			body: 'Unauthorized user session.type'
		};
	}

	// !event.pathParameters as this is a GET request
	// othrwise we would use !event.body

	if (!event.pathParameters) {
		return {
			statusCode: 400,
			body: 'Badly formed request'
		};		
	} else {
		// takes first id or email
		console.log(' --/functions/src/users/get.ts API handler pathParams: ' + JSON.stringify(event.pathParameters) );
		const userFilter: UserFilter = { ...event.pathParameters };
		const usersList = await User.filterListUser(userFilter);
		
		return {
			statusCode: 200,
			body: JSON.stringify(usersList)
		};
	}


});