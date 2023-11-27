// src/routes/users/+page.server.ts
// import  { Role } from '../../../../../../core/user';
import type { PageServerLoad } from './$types'
import type { User as UserType, Role as RoleType } from '../../../../../../core/user';
// import { Role } from '../../../../../../core/user';
// import  { User } from '../../../../../../core/user';
import { env } from '$env/dynamic/public';

export type ExtendedUser = UserType & {
    rolesArray: RoleType[],
    isEditing?: boolean,
};

const filter:UserType = {
    id: '',
    email: '',
    firstName: null,
    lastName: null,
    picture: null,
    roles: null,
};

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async ({ params }) => {
    // console.log('--- load User.getByIdOrEmail.',User.filterListUser(filter));
    // console.log('--- /packages/frontend/src/routes/%28authorised%29/admin/users/+page.server.ts load', params);
    try {
        // const response = await User.filterListUser(null);
        const response = await fetch(env.PUBLIC_API_URL+'/users?id=');
        console.log('response: ' + await JSON.stringify(response));
        if (!response) {
            throw new Error('Failed to fetch users');
        }
        // let users: UserType[] = await response;
        let users: UserType[] = await response.json();

        if (users.length === 0 || !Array.isArray(users)) {
            return { props: { extendedUsers: [] } };
        } else {
            // Process users to create ExtendedUser array
            const extendedUsers: ExtendedUser[] = users.map((user: UserType) => {
                const rolesArray: RoleType[] = user.roles?.split(',') as RoleType[];
                return { ...user, rolesArray, isEditing: false };
            })      
            .sort((a: ExtendedUser, b: ExtendedUser) => {
                if (a.firstName && b.firstName) {
                    return a.firstName.localeCompare(b.firstName);
                }
                return 0;
            });
            return { props: { extendedUsers } };
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return { props: { extendedUsers: [] } }; // Return empty array on error
    }
}
