import { SQL } from './src/sql';
import { uuid } from 'uuidv4';
/**
 * Enum for user roles
 * @enum {string}
 */
export enum Role {
    ADMIN = 'ADMIN',
    ROLE1 = 'ROLE1',
    ROLE2 = 'ROLE2',
    // add more roles as needed
}

/**
 * User type
 * for use as a filter criteria
 * @type
 */
export type UserFilter = {
    [P in keyof User]?: User[P] | null;
  };

/**
 * User class
 * @class
 */
export class User {
    constructor(
        public id: string,
        public email: string,
        public firstName?: string | null,
        public lastName?: string | null,
        public picture?: string | null,
        public roles?: string | null
    )
    {}

    /**
   * Method to get user by ID or email
   * First of either ID or email is used
   * @param {string} id - The ID of the user
   * @param {string} email - The email of the user
   * @returns {Promise<User>} The user object
   */
    static async getByIdOrEmail(idOrEmail: string): Promise<string> {
        console.log('--- /packages/core/users.ts User.getByIdOrEmail', idOrEmail);
        try {
            const result = await SQL.DB
                .selectFrom('users')
                .selectAll()
                .where((eb) =>
                    eb('email', '=', idOrEmail)
                        .or('id', '=', idOrEmail)
                )
                .executeTakeFirst();

            if (!result) {
                console.log('--- /packages/core/users.ts User.getByIdOrEmail', `User ${idOrEmail} not found`);
                throw new Error(`User ${idOrEmail} not found`);
            }
            console.log('--- /packages/core/users.ts User.getByIdOrEmail', `User ${result.roles} found`);

            const user =  new User(result.id, result.email, result.firstName, result.lastName, result.picture, result.roles);
            console.log('--- /packages/core/users.ts User.getByIdOrEmail user: ', JSON.stringify(user));
            return JSON.stringify(user);
        } catch (error) {
        console.error(error);
        throw error;
        }
    }

    /**
   * Method to create or update the user object
   * @param {User} User - The user object to create or update
   * @returns {Promise<String>} The new user object created or updated
   */
    static async createUpdate(user: User): Promise<string> {
        try {
            if (!user.id) {
                user.id = uuid();
            }
            const response = await SQL.DB
            .insertInto('users')
            .values({
                id: user.id,
                picture: user.picture,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles
            })
            .onConflict((oc) => oc
                .column('id')
            .doUpdateSet({
                email: user.email,
                picture: user.picture,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles
            })
            )
            .execute();
            return JSON.stringify(user);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    /**
   * Method to return a list filtered on the search criteria 
   * returns all if no criteria provided
   * makes partial matches on all criteria provided using LIKE
   * email: %my@email% will match any email containing email
   * @param {UserFilter} UserFilter - The user object with the criteria to filter on (allows id: null and email: null)
   * @returns {Promise<string[]>} The filtered list of users objects
   */
    static async filterListUser(user: UserFilter): Promise<string> {
        try {
            const { id, email, firstName, lastName } = user;
            let query = SQL.DB.selectFrom('users');
        
            if (id) query = query.where('id', 'like', `%${id}%`);
            if (email) query = query.where('email', 'like', `%${email}%`);
            if (firstName) query = query.where('firstName', 'like', `%${firstName}%`);
            if (lastName) query = query.where('lastName', 'like', `%${lastName}%`);
        
            const result: any[] = await query.execute();
        
            if (!result || result.length === 0) {
            throw new Error('User not found');
            }
        
            // Map the result to User instances
            const users: User[] = result.map(userResult => new User(userResult.id, userResult.email, userResult.firstName, userResult.lastName, userResult.picture, userResult.roles));
        
            return JSON.stringify(users);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
   * Method to delete the user object
   * @param {User} User - The user object to delete
   * @returns {Promise<void>} 
   */
    static async delete(id?: string, email?: string): Promise<void> {
        try {
            if (!id && !email) {
            throw new Error('You must provide either an id or an email to delete a user');
            }
        
            let query = SQL.DB.deleteFrom('users');
        
            if (id) {
            query = query.where('id', '=', id);
            } else if (email) {
            query = query.where('email', '=', email);
            }
        
            await query.execute();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
    * Method to assign a role to the user object
    * Takes first id or email
    * @param {Role} newRole - The new role to be assigned
    * @param {id?} id - The id of the user object to update
    * @param {email?} email - The email of the user object to update
    * @returns {Promise<User>} The updaetd user object
    */
    static async assignRole(newRole: Role, id?: string, email?: string): Promise<string> {
        if (!id && !email) {
            throw new Error('You must provide either an id or an email to assign a role');
        }
        
        try {
            const userJson = await User.getByIdOrEmail(id ||'');
            const user = JSON.parse(userJson);
            const existingRoles = user.roles || '';
            const roles = existingRoles ? existingRoles.split(',') : [];
        
            if (!roles.includes(newRole)) {
            roles.push(newRole);
            }
        
            await SQL.DB
            .insertInto('users')
            .values({
                id: user.id,
                picture: user.picture,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: roles.join(',')
            })
            .onConflict((oc) => oc
                .column('id')
            .doUpdateSet({
                email: user.email,
                picture: user.picture,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: roles.join(',')
            })
            )
            .execute();
        
            // Fetch the updated user record from the database
            const updatedUser = await User.getByIdOrEmail(id || '');
            return String(updatedUser);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }      

    /**
    * Method to revoke a role from the user object
    * Takes first id or email
    * @param {Role} delRole - The role to be revoked
    * @param {id?} id - The id of the user object to update
    * @param {email?} email - The email of the user object to update
    * @returns {Promise<User>} The updaetd user object
    */
    static async revokeRole(delRole: Role, id?: string, email?: string): Promise<string> {
        if (!id && !email) {
        throw new Error('You must provide either an id or an email to revoke a role');
        }
    
        try {
        const userJson = await User.getByIdOrEmail(id || email || '');
        const user = JSON.parse(userJson);
        const existingRoles = user.roles || '';
        const roles = existingRoles ? existingRoles.split(',') : [];
    
        // Remove the role if it exists
        const index = roles.indexOf(delRole);
        if (index > -1) {
            roles.splice(index, 1);
        }
    
        await SQL.DB
            .insertInto('users')
            .values({
                id: user.id,
                picture: user.picture,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: roles.join(',')
            })
            .onConflict((oc) => oc
                .column('id')
            .doUpdateSet({
                email: user.email,
                picture: user.picture,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: roles.join(',')
            })
            )
            .execute();
    
        // Fetch the updated user record from the database
        const updatedUser = await User.getByIdOrEmail(id || email || '');
        return updatedUser;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}