import type { User, Role } from 'shared_types';
import { updateUserByID, getUserByID } from '../../../core/src/users';


// async function to add roles to user with userId of userId
// first get the user from the db
// then add the roles to the user
// then update the user in the db
// then return the user
export const addUserRoles = async (userId: string, addRoles: Role[]) => {
    const user = await getUserByID(userId);
    // split the roles string into an array of roles
    const roles = user.roles?.split(',');    
    // add the roles to the array of roles for the user if not already there
    addRoles.forEach(role => {
        if (!roles?.includes(role)) {
            roles?.push(role);
        }
    });
    // replace the roles to the user
    user.roles = roles?.join(',') ?? '';
    const updatedUser = await updateUserByID(user);
    return updatedUser;
}


