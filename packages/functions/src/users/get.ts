import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
import { User } from '../../../core/user';

export const main = ApiHandler(async (event) => {
	// returns user info of userid 

	const session = useSession();
	console.log('--- /user/get.ts session ' + JSON.stringify(session));
	// get cookie from event.headers.cookie
	console.log('--- /user/get.ts event.headers: ' + JSON.stringify(event.headers));
	console.log('--- /user/get.ts SessionType: ' + session?.type);

	if ( !session?.type || session.type === 'public' ) {
	// if ( false ) {
		console.log(' --/functions/src/users/get.ts API handler session.type: ' + session?.type);
		return {
			redirect: '/login',
			statusCode: 401,
			body: 'Unauthorized user session.type'
		};
	} else if (!event.pathParameters) {

	// we are being ambiguous about the data type here
	// we want to allow get by id or get by email
		
		// !event.pathParameters as this is a GET request
		// othrwise we would use !event.body
		return {
			statusCode: 400,
			body: 'Badly formed request'
		};		
	} else {
		let data:string
		// takes first id or email
		data = event.pathParameters.id||event.pathParameters.email||'';
		const res = await User.getByIdOrEmail(data);

		return {
			statusCode: 200,
			body: JSON.stringify(res)
		};
	}


});