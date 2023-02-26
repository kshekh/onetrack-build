import { MetaOAuth } from '$lib/store';
import { showMessage } from './ToastService';
import { dev } from '$app/environment';
import { sendLocalRequest } from './HttpRequests';

const META_API_VERSION = "v14.0";
const META_SCOPE = 'ads_read';

const GOOGLE_DEV_TOKEN = "3fIaByZWxeDG5B8aUFsM6Q";
const GOOGLE_SCOPE = 'https%3A//www.googleapis.com/auth/adwords';
const GOOGLE_CLIENT_ID = '486772655136-d3re7dcfiegqmrte6gj2dhfm4poeivf7.apps.googleusercontent.com';

const TIKTOK_APP_ID = '7164355019616059393';
const TIKTOK_STATE = 'onetrack_tiktok';
const TIKTOK_REDIRECT_URL = 'https%3A//app.one-track.io';
const TIKTOK_RID = '4r5uz9kna9b';

//META Requests
export async function GetFacebookToken() {
    FB.login(HandleFBLoginResponse, { scope: META_SCOPE });
}

export function HandleFBLoginResponse(response) {
    try {
        if (response.authResponse) {
            MetaOAuth.set(response.authResponse);
        } else {
            showMessage(
                "Couldn't access facebook auth",
                'User cancelled login or did not fully authorize.',
                'error'
            );
            MetaOAuth.set(null);
        }
    } catch (err) {
        console.error(err);
        showMessage(
            'Meta API access error',
            'Unable to connect to Meta API to get Ad Accounts.',
            'error'
        );
        MetaOAuth.set(null);
    }
}

export async function GetMetaAdAccountsList(accessToken: string, userId: string) {
    try {
        let accounts = [];
        let breakNext = false;
        let requestGotThrough = false;
        let url = `https://graph.facebook.com/${META_API_VERSION}/${userId}?fields=id,name,adaccounts{id,name}&access_token=${accessToken}`;

        while (!breakNext) {
            breakNext = true;
            let response = await fetch(url);
            if (response.ok) {
                let json = await response.json();
                if (requestGotThrough) {
                    json = { adaccounts: json };
                }
                if (json.adaccounts) {
                    accounts = [
                        ...accounts,
                        ...json.adaccounts.data
                    ];
                    if (json.adaccounts.paging && json.adaccounts.paging.next) {
                        url = json.adaccounts.paging.next;
                        breakNext = false;
                    }
                }
                requestGotThrough = true;
            }
        }
        if (requestGotThrough) {
            return { accounts };
        }
        return null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetMetaLongTermAccessToken(shortTermAccessToken: string) {
    try {
        let url = "/server/meta/accessToken";
        let response = sendLocalRequest("POST", url, JSON.stringify({
            shortTermAccessToken
        }))
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
//GOOGLE Requests
export async function GetGoogleAccessToken() {
    let url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${GOOGLE_SCOPE}&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http%3A//localhost%3A5173/tracking/sources/google/redirect&client_id=${GOOGLE_CLIENT_ID}`;
    window.location = url;
}

export async function GetGoogleAdAccountsList(accessToken) {
    let accounts = [];
    let response = await getGoogleUsersList(accessToken);
    let userIds = response.resourceNames;
    for (let userId of userIds) {
        var userInfo = await getGoogleUserInfo(accessToken, userId);
        if (!userInfo) {
            break;
        }
        userInfo[0].results.forEach(info => {
            accounts.push({
                id: info.customerClient.id,
                name: info.customerClient.descriptiveName
            });
        });
    }
    return accounts;
}

async function getGoogleUsersList(accessToken) {
    let userIds = await sendRequestToGoogleAdsAPI(accessToken, "customers:listAccessibleCustomers");
    return userIds;
}

async function getGoogleUserInfo(accessToken, userId) {
    let url = `${userId}/googleAds:searchStream`;

    let data = {
        query: `SELECT
        customer_client.currency_code,
        customer_client.descriptive_name,
        customer_client.id,
        customer.id,
        customer.descriptive_name
      FROM customer_client`
    }
    let userInfo = await sendRequestToGoogleAdsAPI(accessToken, url, data, "POST");
    return userInfo;
}

async function sendRequestToGoogleAdsAPI(accessToken, urlAppend, data = null, method = "GET") {
    try {
        let headers = {
            "Content-Type": "application/json",
            "developer-token": GOOGLE_DEV_TOKEN,
            Authorization: `Bearer ${accessToken}`
        }
        let url = `https://googleads.googleapis.com/v11/${urlAppend}`;
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
        return [];
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

//TIKTOK Requests
export async function GetTikTokAccessToken() {
    let url = `https://ads.tiktok.com/marketing_api/auth?app_id=${TIKTOK_APP_ID}&state=${TIKTOK_STATE}&redirect_uri=${TIKTOK_REDIRECT_URL}&rid=${TIKTOK_RID}`;
    window.location = url;
}

export async function GetTikTokAccessTokenAndAdvertisersIds(authCode) {
    try {
        let url = "/server/tiktok/accessToken";
        let json = await sendLocalRequest("POST", url, JSON.stringify({
            app_id: TIKTOK_APP_ID,
            auth_code: authCode
        }));

        if (json.message == "OK") {
            return json;
        }
        return {
            data: null,
            error: json.message
        }
    }
    catch (error) {
        console.error(error);
        return {
            data: null,
            error
        }
    }
}

export async function GetTikTokAdvertisersDetails(accessToken, ids) {
    try {
        let url = "/server/tiktok/ad_account_details";
        let json = await sendLocalRequest("POST", url, JSON.stringify({
            accessToken,
            ids
        }))
        if (json.message == "OK") {
            return json;
        }
        return {
            data: null,
            error: json.message
        }
    }
    catch (error) {
        console.error(error);
        return {
            data: null,
            error
        }
    }
}