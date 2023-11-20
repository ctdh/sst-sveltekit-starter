import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
import { getUserByID } from '../../../core/src/users';

export const handler = ApiHandler(async () => {
	const session = useSession();
	console.log({'session:': session });

	// Check user is authenticated
	if (session.type !== 'user') {
        // throw error and console the session.type
        console.log('--- check user session.type', session.type);
        console.log({sessionType: session.type });
        throw new Error('Not authenticated');
	}
	console.log('--- checking user session.type', session.type);
	const userFromSession = await getUserByID(session.properties.userId);
	console.log('--- checking user.id', userFromSession.id);
	console.log({session_response: JSON.stringify({ 
		userInfo: userFromSession,
		type: session.type,
	 }) });
	return {
		statusCode: 200,
		body: JSON.stringify({ 
			userId: userFromSession.id,
			type: session.type,
		 })
	};
});