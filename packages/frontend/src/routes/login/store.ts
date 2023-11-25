import { writable } from 'svelte/store';

export const authState = writable({
    isSigningIn: false,
    expiresAt: 0
  });
export const email = writable('');
