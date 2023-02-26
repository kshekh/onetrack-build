import { sendGetRequest, sendPutRequest, sendPostRequest } from './HttpServiceV2';
import { API_KEY } from '$lib/store';
const attributionModel = "adFirst";

export async function GetEventsDataFromV2API(workspaceId, startDate, endDate, eventType, attributionWindow) {
    let response = await sendGetRequest(
        `v2/workspaces/${workspaceId}/events?start-date=${startDate.format('YYYY-MM-DD')}&end-date=${endDate.format('YYYY-MM-DD')}&event=${eventType}&attribution-window=${attributionWindow}&attribution-model=${attributionModel}`
    )
    return response;
}
export async function GetStatsFromV2API(workspaceId, platform, startDate, endDate, attributionWindow) {
    let response = await sendGetRequest(
        `v2/workspaces/${workspaceId}/stats/${platform}?start-date=${startDate.format('YYYY-MM-DD')}&end-date=${endDate.format('YYYY-MM-DD')}&attribution-window=${attributionWindow}&attribution-model=${attributionModel}`
    )
    return response;
}
export async function SetAPIKey() {
    let response = await sendGetRequest(
        "v2/token",
        null,
        true,
        false
    )
    API_KEY.set(response);
}
export async function GetAllWorkspaceV2API() {
    let response = await sendGetRequest(
        "v2/workspaces"
    );
    response = response.map(ws => {
        if (!ws.connectors) {
            ws.connectors = [];
        }
        return ws;
    });
    return response;
}
export async function UpdateWorkspaceV2API(workspaceId, currency, timezone) {
    await sendPutRequest(`v2/workspaces/${workspaceId}`, { currency, timezone });
}
