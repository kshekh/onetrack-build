import { dev } from '$app/environment';
import { Error500 } from '$lib/store';
const BaseAPILink = "https://app.one-track.io/api/";
const BaseSandboxApiLink = "https://sandbox.api.one-track.io/";
export async function sendPostRequest(url: string, data: object, headers: HeadersInit | null = null) {
    try {
        const method = 'POST';
        let response;
        if (data) {
            response = await MakeHttpRequest(method, url, data, headers);
        }
        else {
            response = await MakeHttpRequest(method, url, null, headers);
        }
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function sendPutRequest(url: string, data: object, headers: HeadersInit | null = null) {
    try {
        const method = 'PUT';
        let response;
        if (data) {
            response = await MakeHttpRequest(method, url, data, headers);
        }
        else {
            response = await MakeHttpRequest(method, url, null, headers);
        }
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function sendGetRequest(url: string, headers: HeadersInit | null = null, show500 = true) {
    try {
        const method = 'GET';
        let response = await MakeHttpRequest(method, url, null, headers, show500);
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function sendDeleteRequest(url: string, headers: HeadersInit | null = null) {
    try {
        const method = 'DELETE';
        let response = await MakeHttpRequest(method, url, null, headers);
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

async function MakeHttpRequest(method: string, url: string, data: Object | null = null, headers: HeadersInit | null = null, show500 = true) {
    try {
        if (dev) {
            url = `${BaseSandboxApiLink}${url}`;
        }
        else {
            url = `${BaseAPILink}${url}`;
        }
        if (headers == null) {
            headers = {
                "Content-Type": "application/json"
            }
        }
        let requestObj: RequestInit = {
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
