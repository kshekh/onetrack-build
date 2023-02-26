import type { User } from 'firebase/auth';
import moment from 'moment';
export function isValidUser(user: null | string | User) {
    if (user == null) {
        return false;
    }
    if (user === "init") {
        return false
    }
    return true;
}
export function getTimeZoneAdjustedTimestampSeconds(timestamp: number) {
    let now = moment().unix();
    if (timestamp > now) {
        return now
    }
    return timestamp;
}