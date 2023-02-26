import { get } from 'svelte/store';
import { API_KEY, BaseAPILink, Error500 } from '$lib/store';
import { getCurrentUserIdToken } from '$lib/services/AuthService';
export async function sendPostRequest(data, url, headers = null) {
    try {
        const method = 'POST';
        let response;
        if (data) {
            response = await MakeHttpRequest(method, `${get(BaseAPILink)}${url}`, data, headers);
        }
        else {
            response = await MakeHttpRequest(method, `${get(BaseAPILink)}${url}`, null, headers);
        }
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function sendPutRequest(url, data, headers = null) {
    try {
        const method = 'PUT';
        let response;
        if (data) {
            response = await MakeHttpRequest(method, `${get(BaseAPILink)}${url}`, data, headers);
        }
        else {
            response = await MakeHttpRequest(method, `${get(BaseAPILink)}${url}`, null, headers);
        }
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function sendGetRequest(url, headers = null, show500 = true, addAuthorizationHeader = true) {
    try {
        const method = 'GET';
        let response = await MakeHttpRequest(method, `${get(BaseAPILink)}${url}`, null, headers, show500, addAuthorizationHeader);
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function sendDeleteRequest(url, headers = null) {
    try {
        const method = 'DELETE';
        let response = await MakeHttpRequest(method, `${get(BaseAPILink)}${url}`, null, headers);
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

async function MakeHttpRequest(method, url, data = null, headers = null, show500 = true, addAuthorizationHeader = true) {
    try {
        if (headers == null) {
            let firebaseToken = await getCurrentUserIdToken();

            headers = {
                "Content-Type": "application/json",
                "Authentication": `Bearer ${firebaseToken}`,
            }
            if (addAuthorizationHeader) {
                headers.Authorization = `Bearer ${get(API_KEY)}`
            }
        }
        let requestObj = {
            method,
            headers
        }
        if (data) {
            requestObj.body = JSON.stringify(data);
        }
        let response = await fetch(url, requestObj);
        if (response.ok) {
            let json = await response.json();
            return json;
        }
        Error500.set(null);
        return null;
    }
    catch (error) {
        if (show500) {
            Error500.set({ error, url });
        }
        console.error(error);
        return null;
    }
}
