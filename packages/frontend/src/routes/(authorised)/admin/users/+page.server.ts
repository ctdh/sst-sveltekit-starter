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
        // const response = await fetch(env.PUBLIC_API_URL+'/users?id=');
        
        const response = await fetch(env.PUBLIC_API_URL+'/users', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidXNlciIsInByb3BlcnRpZXMiOnsidXNlcklkIjoiYTNmNTJhOWItMzEzNi00MWFjLWI2NmMtZjNhZGEwZTZkYjYxIn0sImlhdCI6MTcwMTM4NTA3N30.E96EQOC1I5eaoM4lmIRANF1QAbxuIsUU1AvC4EB8UPOHCg1SMHLJHq8CS_ov3FAyrjnNOKctcc_35WeO9o2Z7iftQhrKC4CxlWBGOxB47uZnZxGOiJHSjXbsaZjQ_PjqwluBIQxyN_ARE2w7SueY2FSRxGf4mBnm3Vw91f5dsHNW9D_keLtgROzcO8D51-VvES0ilVcfaIw-RB6HmsHsUETn9SO1TZAa0yyoWTkVgZUxHvOKergQ9xrd7tjbQwFk2zB6RyNRDyBCSMieytJqemp4tWohRKPrUTSnpt7xqe2iTfqV3XmY_w2efwZM_b987kmcD8iJFFKJei6JxsywDA',
            },
        });
        console.log('Get users response: ' + await JSON.stringify(response));
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
