import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    getAuth,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged,
    sendPasswordResetEmail,
    confirmPasswordReset,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    type Auth
} from 'firebase/auth';
import { User } from '$lib/store';
import { InitDataFlow } from './WorkspaceService';

let app: FirebaseApp;
let auth: Auth;
let isInitialized = false;
export function StartApp(api_Key: string, auth_Domain: string) {
    if (isInitialized) {
        return;
    }
    app = initializeApp({
        apiKey: api_Key,
        authDomain: auth_Domain,
    });

    auth = getAuth(app);
    onAuthStateChanged(auth, user => {
        User.set(user);
        InitDataFlow(user);
    });
    isInitialized = true;
}

export async function signIn(email: string, password: string) {
    try {
        await setPersistence(auth, browserLocalPersistence)
        await signInWithEmailAndPassword(auth, email, password);
        return auth.currentUser;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
export async function signUp(email: string, password: string, name: string) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: name
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}
export async function resetPassword(email: string) {
    try {
        await sendPasswordResetEmail(auth, email)
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
export async function sendPasswordResetCode(code: string, newPassword: string) {
    try {
        await confirmPasswordReset(auth, code, newPassword)
    }
    catch (err) {
        console.log(err);
    }
}
export async function signOut() {
    await auth.signOut();
}
export async function getFirebaseCurrentUser() {
    return auth.currentUser;
}
export async function getCurrentUserAccessToken() {
    const accessToken = auth.currentUser?.accessToken;
    return accessToken;
}
export async function getCurrentUserIdToken() {
    const idToken = await auth.currentUser?.getIdToken();
    return idToken;
}
export async function updateUserPassword(newPassword: string) {
    if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
    }
}
export async function verifyCurrentPassword(currentPassword: string) {
    try {
        let user = auth.currentUser;
        if (!user?.email) {
            return null;
        }
        const credentials = EmailAuthProvider.credential(
            user.email,
            currentPassword
        )
        let res = await reauthenticateWithCredential(user, credentials);
        return res;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}