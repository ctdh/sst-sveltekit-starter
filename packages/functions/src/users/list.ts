import { ApiHandler } from 'sst/node/api';
import { SessionTypes, useSession } from 'sst/node/auth';
// import type { User } from 'shared_types';
import { User, UserFilter } from '../../../core/user';

export const main = ApiHandler(async (event) => {
	console.log(' --/functions/src/users/get.ts API handler');
	// returns user info of userid 

	const session = useSession();
	if ( !session?.type || session.type === 'public' ) {
		return {
			redirect: '/login',
			statusCode: 401,
			body: 'Unauthorized user session.type'
		};
	} else if (!event.pathParameters) {

		// !event.pathParameters as this is a GET request
		// othrwise we would use !event.body
		return {
			statusCode: 400,
			body: 'Badly formed request'
		};		
	} else {
		let data:UserFilter = event.queryStringParameters as unknown as UserFilter;
		console.log('--- /user/get.ts data: ' + JSON.stringify(data));
		const res = await User.filterListUser(data);

		return {
			statusCode: 200,
			body: JSON.stringify(res)
		};
	}


});