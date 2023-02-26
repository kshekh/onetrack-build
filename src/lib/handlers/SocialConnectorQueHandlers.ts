import { CreateSocialConnector } from '../services/SocialConnectorHttpService';
import { ReloadWorkspaces } from '$lib/services/WorkspaceService';
import { Workspace, MetaConnectorsQue, GoogleConnectorsQue, TiktokConnectorsQue } from '$lib/store';
import { get } from 'svelte/store';
export function InitConnectorHandler() {
    MetaConnectorsQue.subscribe(async (ac) => {
        if (!ac) {
            return;
        }
        await CreateSocialConnectors(ac, "meta", MetaConnectorsQue);
    })
    GoogleConnectorsQue.subscribe(async (ac) => {
        if (!ac) {
            return;
        }
        await CreateSocialConnectors(ac, "google", GoogleConnectorsQue);
    })
    TiktokConnectorsQue.subscribe(async (ac) => {
        if (!ac) {
            return;
        }
        await CreateSocialConnectors(ac, "tiktok", TiktokConnectorsQue);
    })
}

async function CreateSocialConnectors(accounts, platform, store) {
    let workspace = get(Workspace);
    if (!workspace) {
        return;
    }
    for (let ac of accounts) {
        await CreateSocialConnector(workspace._id, platform, ac.name, ac.accessToken, ac.id);
        await ReloadWorkspaces();
    };
    if (store) {
        store.set(null);
    }
}