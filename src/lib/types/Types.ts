export type TanstackTableStyling = {
    table: string,
    thead: {
        self: string,
        tr: string,
        th: {
            innerDiv: string,
            first: string,
            middle: string,
            last: string
        }
    },
    tbody: {
        self: string,
        tr: string,
        td: {
            first: string,
            middle: string,
            last: string
        }
    },
    tfoot: {
        self: string,
        tr: string,
        th: {
            first: string,
            middle:
            string,
            last: string
        }
    }
}
export type AttributionSearchItem = {
    name: string,
    state: boolean,
    id: string,
    campaignId: string | null | undefined,
    adSetId: string | null | undefined,
    accountId: string | null | undefined
}
export type FaqSection = {
    category: string;
    questions: FaqQuestion[];
}
export type FaqQuestion = {
    question: string;
    answer: string;
    open: boolean;
}
export type UserPostRequestItem = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    gender: string,
    address: {
        street: string,
        streetAlternative: string,
        streetNumber: string,
        zip: string,
        city: string,
        province: string,
        country: string,
        company: string,
        countryCode: string,
        provinceCode: string,
    }
}
export type WorkspaceDataType = {
    _id: string,
    name: string,
    billing: {
        address: {
            city: string,
            country: string,
            email: string,
            firstName: string,
            gender: string,
            lastName: string,
            province: string,
            street: string,
            streetNumber: string,
            title: string,
            zip: string
        },
        companyName: string,
        currency: string
    },
    connectors: ConnectorDataType[],
    customers: {
        id: string,
        role: string
    }[],
    isEnabled: boolean,
    subscription: any,
    timezone: string
}
export interface ConnectorDataType {
    id: string,
    accessToken?: string,
    accountId?: string,
    active: boolean,
    clientId?: string,
    measurementId?: string,
    name?: string,
    platform?: string,
    type: string,
    domain?: string
}

export type EnvSecrets = {
    FIREBASE_URL: string,
    FIREBASE_API_KEY: string,
    DATA_SERVICE_URL: string
}
export interface utmDataItem {
    isExpanded: boolean;
    isOdd: boolean;
    logo: string;
    name: string;
    text: string;
    fromText: string;
    utmCode: string;
    displayUtm?: string;
}
export interface SelectionDropdownItem {
    id: string,
    state: boolean,
    name: string,
    icon: string
}
export interface CSVExportStore {
    metaCampaignsSelected?: boolean,
    metaAdSetsSelected?: boolean,
    metaAdsSelected?: boolean,
    allEventsExportSelected?: boolean
}