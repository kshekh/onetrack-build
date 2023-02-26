import { GetColumnDefinition } from '$lib/helpers/TableHelpers';
import {
    currencyFormatter,
    percentageSymbolFormatter,
    getAverage,
    getSum,
    noFormatter
} from '$lib/helpers/MiscHelpers';

export enum GridDataTypes {
    campaigns,
    adsets,
    ads
}

export const defaultGridStyling = {
    table: 'min-w-full border-collapse ',
    thead: {
        self: 'sticky top-0 z-20 bg-color before:absolute before:bg-dropdown before:shadow-glass before:opacity-80 before:inset-0 before:backdrop-blur-2.5xl after:h-px after:bg-grey after:absolute after:inset-x-0 after:bottom-0',
        tr: 'relative z-10 ',
        th: {
            innerDiv: 'overflow-auto resize-x pb-4 pt-4 px-2',
            first: 'text-left text-sm font-semibold text-white',
            middle: ' border-l border-grey text-left text-sm font-semibold text-white before:absolute before:inset-y-0 before:w-px before:bg-grey before:-left-px relative',
            last: ' border-l border-grey relative text-left text-sm font-semibold before:absolute before:inset-y-0 before:w-px before:bg-grey before:-left-px relative'
        }
    },
    tbody: {
        self: 'divide-y divide-grey',
        tr: '',
        td: {
            first: 'text-sm font-medium text-white py-2 px-2 break-word',
            middle:
                ' border-l border-grey py-2 px-2 text-sm text-white break-word',
            last: ' border-l border-grey relative py-2 px-2 text-sm font-medium break-word'
        }
    },
    tfoot: {
        self: 'bottom-0 sticky bg-color before:absolute before:bg-dropdown before:shadow-glass before:opacity-80 before:inset-0 before:backdrop-blur-2.5xl after:h-px after:bg-grey after:absolute after:inset-x-0 after:top-0',
        tr: 'sticky relative z-10 ',
        th: {
            first: 'sticky py-2 px-2 text-left text-sm font-semibold text-white ',
            middle:
                'sticky border-l border-grey py-2 px-2 text-left text-sm font-semibold text-white before:absolute before:inset-y-0 before:w-px before:bg-grey before:-left-px relative',
            last: 'sticky border-l border-grey relative py-2 px-2 text-left text-sm font-semibold before:absolute before:inset-y-0 before:w-px before:bg-grey before:-left-px relative'
        }
    }
};

export function loadRows(source: any, gridType: GridDataTypes) {
    //Filters out the ads or ad sets which are not active any longer (have no account Id and account name)
    source = source.filter(x => x.accountName);

    let data = [];
    let GridTypeNamePrefixer = "Campaign";
    let GridTypePropertyPrefixer = "campaign";
    if (gridType === GridDataTypes.adsets) {
        GridTypeNamePrefixer = "Ad Set";
        GridTypePropertyPrefixer = "adSet";
    }
    if (gridType === GridDataTypes.ads) {
        GridTypeNamePrefixer = "Ad";
        GridTypePropertyPrefixer = "ad";
    }
    source.forEach((row) => {
        let obj = {
            accountName: row.accountName,
            adSpend: row.adSpend.toFixed(2),
            ROAS: row.ROAS.toFixed(2),
            oneTrackROAS: row.oneTrackROAS.toFixed(2),
            oneTrackROASDiff: row.oneTrackROASDiff.toFixed(2),
            orderValue: row.orderValue.toFixed(2),
            oneTrackOrderValue: row.oneTrackOrderValue.toFixed(2),
            orders: row.orders.toFixed(0),
            oneTrackOrders: row.oneTrackOrders.toFixed(0),
            orderValueAverage: row.orderValueAverage.toFixed(2),
            oneTrackOrderValueAverage: row.oneTrackOrderValueAverage.toFixed(2),
            CPO: row.CPO.toFixed(2),
            oneTrackCPO: row.oneTrackCPO.toFixed(2),
            leads: row.leads.toFixed(2),
            oneTrackLeads: row.oneTrackLeads.toFixed(2),
            CPL: row.CPL.toFixed(2),
            oneTrackCPL: row.oneTrackCPL.toFixed(2),
            CPC: row.CPC.toFixed(2),
            CTR: row.CTR.toFixed(2),
            CPM: row.CPM.toFixed(2),
            CPATC: row.CPATC.toFixed(2),
            CPIC: row.CPIC.toFixed(2),
            ATCs: row.ATCs.toFixed(0),
            ICs: row.ICs.toFixed(0)
        }
        if (gridType === GridDataTypes.campaigns) {
            obj.campaignName = row.campaignName;
            obj.campaignId = row.campaignId;
        }
        else if (gridType === GridDataTypes.adsets) {
            obj.adSetName = row.adSetName;
            obj.adSetId = row.adSetId;
        }
        else {
            obj.adName = row.adName;
            obj.adId = row.adId;
        }
        data.push(obj);
    });
    let metaSummaryRoas =
        Number(getSum(source.map((x) => x.orderValue))) / Number(getSum(source.map((x) => x.adSpend)));
    let oneTrackSummaryRoas =
        Number(getSum(source.map((x) => x.oneTrackOrderValue))) /
        Number(getSum(source.map((x) => x.adSpend)));
    const TotalAdSpend = getSum(
        source.map((x) => x.adSpend),
        2
    );
    const TotalLeads = getSum(
        source.map((x) => x.leads),
        2
    );
    const TotalOneTrackLeads = getSum(
        source.map((x) => x.oneTrackLeads),
        2
    );
    const AverageCPL = Number(TotalAdSpend) / Number(TotalLeads);
    const AverageOnTrackCPL = Number(TotalAdSpend) / Number(TotalOneTrackLeads);

    let columns = [
        GetColumnDefinition(
            'accountName',
            'Account Name',
            'meta',
            `Summary (${source.length})`,
            noFormatter,
            true
        ),
        GetColumnDefinition(`${GridTypePropertyPrefixer}Name`, `${GridTypeNamePrefixer} Name`, 'meta'),
        GetColumnDefinition(`${GridTypePropertyPrefixer}Id`, `${GridTypeNamePrefixer} ID`, 'meta'),
        GetColumnDefinition(
            'adSpend',
            'Ad Spend',
            'meta',
            TotalAdSpend,
            currencyFormatter
        ),
        GetColumnDefinition('ROAS', 'ROAS', 'meta', metaSummaryRoas.toFixed(2)),
        GetColumnDefinition('oneTrackROAS', 'ROAS', 'onetrack', oneTrackSummaryRoas.toFixed(2)),
        GetColumnDefinition(
            'oneTrackROASDiff',
            'ROAS OFF',
            'meta',
            (oneTrackSummaryRoas - metaSummaryRoas).toFixed(2)
        ),
        GetColumnDefinition(
            'orderValue',
            'Order Value',
            'meta',
            getSum(source.map((x) => x.orderValue)),
            currencyFormatter
        ),
        GetColumnDefinition(
            'oneTrackOrderValue',
            'Order Value',
            'onetrack',
            getSum(source.map((x) => x.oneTrackOrderValue)),
            currencyFormatter
        ),
        GetColumnDefinition(
            'orders',
            'Orders',
            'meta',
            getSum(
                source.map((x) => x.orders),
                0
            )
        ),
        GetColumnDefinition(
            'oneTrackOrders',
            'Orders',
            'onetrack',
            getSum(
                source.map((x) => x.oneTrackOrders),
                0
            )
        ),
        GetColumnDefinition(
            'orderValueAverage',
            'AOV',
            'meta',
            getAverage(source.map((x) => x.orderValueAverage)),
            currencyFormatter
        ),
        GetColumnDefinition(
            'oneTrackOrderValueAverage',
            'AOV',
            'onetrack',
            getAverage(source.map((x) => x.oneTrackOrderValueAverage)),
            currencyFormatter
        ),
        GetColumnDefinition(
            'CPO',
            'CPO',
            'meta',
            getAverage(
                source.map((x) => x.CPO),
                2
            ),
            currencyFormatter
        ),
        GetColumnDefinition(
            'oneTrackCPO',
            'CPO',
            'onetrack',
            getAverage(
                source.map((x) => x.oneTrackCPO),
                2
            ),
            currencyFormatter
        ),


        GetColumnDefinition(
            'leads',
            'Leads',
            'meta',
            TotalLeads,
        ),
        GetColumnDefinition(
            'oneTrackLeads',
            'Leads',
            'onetrack',
            TotalOneTrackLeads,
        ),
        GetColumnDefinition(
            'CPL',
            'CPL',
            'meta',
            AverageCPL,
            currencyFormatter
        ),
        GetColumnDefinition(
            'oneTrackCPL',
            'CPL',
            'onetrack',
            AverageOnTrackCPL,
            currencyFormatter
        ),
        GetColumnDefinition(
            'CPC',
            'CPC',
            'meta',
            getAverage(
                source.map((x) => x.CPC),
                2
            ),
            currencyFormatter
        ),
        GetColumnDefinition(
            'CTR',
            'CTR',
            'meta',
            getAverage(
                source.map((x) => x.CTR),
                2
            ),
            percentageSymbolFormatter
        ),
        GetColumnDefinition(
            'CPM',
            'CPM',
            'meta',
            getAverage(
                source.map((x) => x.CPM),
                2
            ),
            currencyFormatter
        ),
        GetColumnDefinition(
            'CPATC',
            'CPATC',
            'meta',
            getAverage(
                source.map((x) => x.CPATC),
                2
            ),
            currencyFormatter
        ),
        GetColumnDefinition(
            'CPIC',
            'CPIC',
            'meta',
            getAverage(
                source.map((x) => x.CPIC),
                2
            ),
            currencyFormatter
        ),
        GetColumnDefinition(
            'ATCs',
            'Count ATC',
            'meta',
            getSum(
                source.map((x) => x.ATCs),
                0
            )
        ),
        GetColumnDefinition(
            'ICs',
            'Count IC',
            'meta',
            getSum(
                source.map((x) => x.ICs),
                0
            ),
            noFormatter,
            false,
            true
        )
    ];
    return { data, columns };
}