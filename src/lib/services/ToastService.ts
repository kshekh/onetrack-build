import { toasts } from 'svelte-toasts';
const position = 'top-right';
const theme = "dark";
function createToast(title: string, description: string, type: string, duration = 3000) {
    return {
        title: title,
        description: description,
        duration: duration,
        placement: position,
        type: type,
        theme: theme,
        onClick: () => { },
        onRemove: () => { }
    }
}
export const showPasswordValidationToast = (message: string) => {
    toasts.add(createToast('Password validation failed', message, "error"));
};

export const showLoginFailToast = (message) => {
    toasts.add(createToast('Failed to login', message, "error"));
};

export const showLoginSuccessToast = (message) => {
    toasts.add(createToast('Successful login', message, "success"));
};

export const showDataWasUpdated = message => {
    toasts.add(createToast('Data updated', message, "success"));
}
export const showPasswordWasUpdated = message => {
    toasts.add(createToast('Password updated', message, "success"));
}
export function showMessage(heading, message, type, duration = 3000) {
    toasts.add(createToast(heading, message, type, duration));
}
export function showStickyToast(title: string, description: string, type: string) {
    return toasts.add({
        title: title,
        description: description,
        duration: -1,
        placement: position,
        type: type,
        theme: theme,
        onClick: () => { },
        onRemove: () => { }
    });
}
export const showCopiedToClipboardToast = () => {
    toasts.add(createToast('Copied Successfully', "Copied to clipboard", "success"));
};
export const showErrorMessage = (message: string) => {
    showMessage(message, "", "error");
}