import { SQL } from './sql';
import { Users } from './sql.generated';
import { uuid } from 'uuidv4';

const createNewUser = async (
	id: string,
	email: string,
	picture: string | undefined,
	first_name: string | undefined,
	last_name: string | undefined
) => {
	console.log('Start CreateNewUser');
	const [result] = await SQL.DB.insertInto('users')
		.values({
			id,
			email,
			picture,
			first_name,
			last_name
		})
		.returningAll()
		.execute();

	return result;
	console.log('result from CreateNewUser', result);
};

const getUserByEmail = async (email: string) => {
	console.log('--- users.ts Start getUserByEmail');
	const [result] = await SQL.DB.selectFrom('users')
		.where('email', '=', email)
		.selectAll()
		.execute();
		console.log('--- getUserByEmail result', result);
	return result;
};

const getUserByID = async (id: string) => {
	const [result] = await SQL.DB.selectFrom('users').where('id', '=', id).selectAll().execute();
	console.log('--- getUserByID result', result);
	return result;
};

const updateUserByID = async (user: Users) => {
   // Generate a new UUID if id is null
   if (!user.id) {
	user.id = uuid();
}

const respone = await SQL.DB
	.insertInto('users')
	.values({
		id: user.id,
		picture: user.picture,
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name
	})
	.onConflict((oc) => oc
		.column('id')
	.doUpdateSet({
		email: user.email,
		picture: user.picture,
		first_name: user.first_name,
		last_name: user.last_name
	})
	)
	.execute();
	return respone;
  }

export { createNewUser, getUserByEmail, getUserByID, updateUserByID };