import { DateTime } from "luxon";

// Function to convert UTC to user's timezone
export default function convertUTCToUserTimeZone(utcDateTimeString, userTimeZone) {
    // Parse the UTC datetime string using Luxon
    const utcDateTime = DateTime.fromISO(utcDateTimeString, { zone: 'utc' });

    // Convert the UTC datetime to the user's timezone
    const userDateTime = utcDateTime.setZone(userTimeZone);

    return userDateTime; // You can customize the format as needed
}