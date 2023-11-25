/**
 * Converts an epoch timestamp to a formatted date string.
 * 
 * The function takes an epoch timestamp and a format string as inputs.
 * The format string can include the following tokens:
 * - dd: Day of the month as two digits (01-31)
 * - MMM: Month name abbreviation (Jan, Feb, Mar, etc.)
 * - yyyy: Four-digit year
 * - HH: Hours in 24-hour format as two digits (00-23)
 * - mm: Minutes as two digits (00-59)
 * - ss: Seconds as two digits (00-59)
 * 
 * The function replaces these tokens in the format string with the corresponding values from the date.
 * 
 * @param {number} epoch - The epoch timestamp to convert, in seconds.
 * @param {string} format - The format string for the output date. Use the tokens above to specify the format.
 * @returns {string} The formatted date string.
 * 
 * @example
 * // Convert epoch to "01 Jan 2021"
 * const formattedDate = epochToDate(1609459200, 'dd MMM yyyy');
 * console.log(formattedDate);
 */
import { addError } from '$lib/stores/error';

export function epochToDate(epoch:number, format:string) {
    const date = new Date(epoch * 1000);

    const day = date.getDate();
    const month = date.getMonth(); // getMonth() returns 0-11
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Replace format tokens with actual values
    // let formattedDate = format;
    // formattedDate = formattedDate.replace('dd', day.toString().padStart(2, '0'));
    // formattedDate = formattedDate.replace('MMM', monthNames[month]);
    // formattedDate = formattedDate.replace('yyyy', year.toString());
    // formattedDate = formattedDate.replace('HH', hours.toString().padStart(2, '0'));
    // formattedDate = formattedDate.replace('mm', minutes.toString().padStart(2, '0'));
    // formattedDate = formattedDate.replace('ss', seconds.toString().padStart(2, '0'));

    // return formattedDate;

    return format
    .replace('dd', day.toString().padStart(2, '0'))
    .replace('MMM', monthNames[month - 1])
    .replace('yyyy', year.toString())
    .replace('HH', hours.toString().padStart(2, '0'))
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('ss', seconds.toString().padStart(2, '0'));
}

// Example usage
const input = 1700654380;
console.log(epochToDate(input, 'dd MMM yyyy')); // Should print the formatted date
