import { writable } from 'svelte/store';
import type { User } from '../../../../core/user';

// Initialize the userStore as null
export const userStore = writable<User>();

export function addUserStore(user: User) {
    // Set the userStore to the new user
    userStore.set(user);
}