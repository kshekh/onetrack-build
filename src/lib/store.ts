import type { User as FirebaseUser } from 'firebase/auth';
import type moment from 'moment';
import { writable } from 'svelte/store';
import type { CSVExportStore, WorkspaceDataType } from '$lib/types/Types';

export const User = writable<FirebaseUser | string | null>("init"); //value should be "init"
export const LoadingState = writable({ show: true, caption: "Setting up data pipelines..." });
export const Error500 = writable<null | { error: string | unknown, url: string }>(null);
export const Customer = writable(null);
export const CustomerToken = writable(null);
export const AllWorkspace = writable<null | WorkspaceDataType[]>(null);
export const Workspace = writable<null | WorkspaceDataType>(null);
export const MarketingData = writable(null);
export const Connectors = writable([]);
export const CurrencySymbol = writable("EUR");
export const CustomerEvents = writable(null);
export const CurrentEventsFilter = writable<string | null>(null);

export const API_KEY = writable(null);
export const BaseAPILink = writable<string | null>(null);
export const FullScreenView = writable<boolean>(false);
//OAuth stores
export const MetaOAuth = writable<null | { accessToken: string, userID: string }>(null);

//Ques
export const DeleteQue = writable<null | { type: string, id: string }>(null);
export const MetaConnectorsQue = writable(null);
export const GoogleConnectorsQue = writable(null);
export const TiktokConnectorsQue = writable(null);
export const CSVExportQue = writable<null | CSVExportStore>(null);

//TimeZone sensitive start and end
export const CurrentRange = writable<null | { start: moment.Moment, end: moment.Moment }>(null);
export const TimeZone = writable(null);

export function CleanDataRelatedStores() {
    MarketingData.set(null);
    CustomerEvents.set(null);
    MetaOAuth.set(null);
    DeleteQue.set(null);
    MetaConnectorsQue.set(null);
    GoogleConnectorsQue.set(null);
    TimeZone.set(null);
    CurrencySymbol.set("EUR");
    Connectors.set([]);
}