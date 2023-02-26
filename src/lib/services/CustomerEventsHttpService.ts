import { sendGetRequest } from '$lib/services/HttpService';
export async function GetAllCustomerEvents(workspaceId, startDate, endDate, skip, limit) {
    let data = await sendGetRequest(
        `frontend/event/${workspaceId}?start-date=${startDate}&end-date=${endDate}&skip=${skip}&limit=${limit}`
    );
    return data;
}
export async function GetAllCustomerEventsByVisitorId(workspaceId, startDate, endDate, skip, limit,visitorId) {
    let data = await sendGetRequest(
        `frontend/event/${workspaceId}?start-date=${startDate}&end-date=${endDate}&skip=${skip}&limit=${limit}&visitorId=${visitorId}`
    );
    return data;
}