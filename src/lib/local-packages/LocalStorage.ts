export default {
    get,
    set,
    remove
}
export function get(key: string) {
    const value = localStorage.getItem(key)
    if (!value) { return null };

    try {
        return JSON.parse(value)
    } catch (error) {
        return value
    }
}
export function set(key: string, value: string | Object) {
    const ret = {}

    if (typeof value === 'string') {
        localStorage.setItem(key, value)
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}
export function remove(key: string) {
    localStorage.removeItem(key)
}