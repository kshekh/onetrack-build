import { sendPostRequest } from './HttpsBaseRequests';
import type { UserPostRequestItem } from '$lib/types/Types';
import { dev } from '$app/environment';

export async function PostNewUser(userToPost: UserPostRequestItem) {
    let response = await sendPostRequest("customers", userToPost);
    return response;
}

export async function sendLocalRequest(method: string, url: string, body: BodyInit | null = null) {
    try {
        if (dev) {
            url = `http://localhost:3000${url}`;
        }
        let request: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (body) {
            request.body = body;
        }
        let response = await fetch(url, request);
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return null;
    }
}