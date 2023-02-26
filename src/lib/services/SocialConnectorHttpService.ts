import { sendPostRequest, sendDeleteRequest } from '$lib/services/HttpService';

export async function CreateSocialConnector(workspaceId, platform, name, accessToken, accountId) {
    let data = {
        platform,
        name,
        type: 'marketing-data',
        accessToken,
        accountId: accountId.split("_")[1],
        //TODO: adding these two for time-being, would delete later
        measurementId: "1111",
        clientId: "aaaaaaaa"
    };
    let res = await sendPostRequest(data, `frontend/workspaces/${workspaceId}/connectors`);
    return res;
}
export async function DeleteSocialConnector(workspaceId, connectorId) {
    let res = await sendDeleteRequest(`frontend/workspaces/${workspaceId}/connectors/${connectorId}`);
    return res;
}