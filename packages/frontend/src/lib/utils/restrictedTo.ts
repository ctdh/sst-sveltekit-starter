import type { User, Role } from '$shared_types';
import { userStore } from '$lib/stores/user';

export function restrictedTo(Roles:Role[]){
    // get JWT of the user and decode it to get the userid
    // get the userInfo from the userStore
    // compare the JWT.userId with the userInfo.userId
    // if they match then check one of the roles of the user is in the Roles array
    // if it is then return true else return false

    const token = localStorage.getItem('token');
    if (!token) return false;
    // const jwtUserId = getUserIdfromJWT();
    // declare userId as userStore.id
    const userId = userStore.subscribe((user:User | null) => user?.id);
    // declare userRoles as userStore.roles for use as a param in a function
    const csvUserRoles = userStore.subscribe((user:User | null) => user?.roles);

    return false;
}

function getMatchingRoles(csvUserRoles: string, allowedRoles: string[]): string[] {
    // Split the CSV string into an array and trim spaces
    const userRoles = csvUserRoles.split(',').map(role => role.trim());
    // Filter the roles that are present in the allowedRoles array
    const matchingRoles = userRoles.filter(role => allowedRoles.includes(role));
    return matchingRoles;
}
