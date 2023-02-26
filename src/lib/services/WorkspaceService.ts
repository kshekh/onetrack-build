import { sendGetRequest, sendPostRequest } from '$lib/services/HttpService';
import { isValidUser } from '$lib/helpers/UserHelpers';
import { sleep } from '$lib/helpers/MiscHelpers';
import { get as getLocalStorage, set as setLocalStorage } from '$lib/local-packages/LocalStorage';
import { get } from 'svelte/store';
import { AllWorkspace, Workspace, Customer, CustomerToken, CurrentRange, TimeZone, CurrencySymbol, Error500 } from '$lib/store';
import { getFirebaseCurrentUser } from './AuthService';
import { SetAPIKey, GetAllWorkspaceV2API } from './BackendRequestV2';
import moment from 'moment-timezone';
import { showMessage } from './ToastService';

const workspaceLocalStorageKey = "workspace";
export async function GetCustomerToken() {
    let firebaseUser = await getFirebaseCurrentUser();
    let headers = {
        "Content-Type": "application/json",
        "Authentication": `Bearer ${firebaseUser.accessToken}`
    }
    let data = await sendPostRequest({
        identity: firebaseUser.email
    },
        'frontend/customer/token',
        headers);
    if (!data?.token) {
        Error500.set(
            {
                error: "Token was null",
                url: "/token"
            });
        return;
    }
    CustomerToken.set(data.token);
}

export async function GetCustomer() {
    await GetCustomerToken();
    let data = await sendGetRequest(
        'frontend/customer'
    );
    return data;
}
export async function InitDataFlow(u) {
    if (!isValidUser(u)) {
        return;
    }

    //TODO: Clen up this when V2 of API is complete
    await SetAPIKey();
    let customer = await GetCustomer();
    Customer.set(customer);
    let workspaces = await GetAllWorkspaceV2API();
    updateWorkspaceRelatedFields(getCurrentWorkspace(workspaces), true);
    AllWorkspace.set(workspaces);
}
function getCurrentWorkspace(allWorkspaces) {
    let workspaceIdFromLocalStorage = getLocalStorage(workspaceLocalStorageKey);
    if (!workspaceIdFromLocalStorage) {
        return allWorkspaces[0];
    }
    let foundWorkspace = allWorkspaces.find(x => x._id === workspaceIdFromLocalStorage);
    if (foundWorkspace) {
        return foundWorkspace;
    }
    return allWorkspaces[0];
}
export async function ReloadWorkspaces() {
    let workspaces = await GetAllWorkspaceV2API();
    updateWorkspaceRelatedFields(getCurrentWorkspace(workspaces));
}
export function updateWorkspaceRelatedFields(workspace, updateRange = false) {
    TimeZone.set(workspace.timezone);
    if (workspace.currency) {
        CurrencySymbol.set(workspace.currency);
    }
    else {
        CurrencySymbol.set(workspace.billing.currency);
    }
    moment.tz.setDefault(workspace.timezone);
    if (updateRange) {
        CurrentRange.set({ start: moment().subtract(7, 'days'), end: moment() })
    }
    setLocalStorage(workspaceLocalStorageKey, workspace._id);
    Workspace.set(workspace);
}
export async function UpdateSelectedWorkspace(workspaceId) {
    showMessage("Updating...", "Changing selected workspace", "info")
    let allWorkspaces = get(AllWorkspace);
    let selectedWorkspace = allWorkspaces.find(x => x._id === workspaceId);
    updateWorkspaceRelatedFields(selectedWorkspace);
    await sleep(1000);
    showMessage("Workspace Updated", "Workspace has been updated successfully", "success")
}