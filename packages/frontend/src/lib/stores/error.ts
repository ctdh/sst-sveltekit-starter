import { writable } from 'svelte/store';

// Initialize the store with an empty array
export const errorStore = writable<string[]>([]);

// Function to add a new error to the store
export function addError(error: string) {
    errorStore.update(errors => {
        errors.push(error);
        // If there are more than 10 errors, remove the oldest one
        if (errors.length > 10) {
            errors.shift();
        }
        return errors;
    });
}