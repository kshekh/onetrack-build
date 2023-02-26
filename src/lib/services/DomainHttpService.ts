import { sendPostRequest, sendDeleteRequest } from '$lib/services/HttpService';

export async function CreateDomainConnector(workspaceId: string, domain: string) {
    let data = {
        platform: 'domain',
        name: domain,
        type: 'event-data',
        domain
    };
    let res = await sendPostRequest(data, `frontend/workspaces/${workspaceId}/connectors`);
    return res;
}
export async function DeleteDomainConnector(workspaceId: string, connectorId: string) {
    let res = await sendDeleteRequest(`frontend/workspaces/${workspaceId}/connectors/${connectorId}`);
    return res;
}