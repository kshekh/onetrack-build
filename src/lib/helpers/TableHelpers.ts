import { noFormatter } from '$lib/helpers/MiscHelpers';
export function GetColumnDefinition(id: string, name: string, iconType = "none", footerValue = null, formatter = noFormatter, isFirst = false, isLast = false, formatFooter = true) {
    let obj = {
        accessorFn: (row) => row[id],
        id,
        iconType,
        cell: (info) => formatter(info.getValue()),
        header: () => name,
        footer: (info) => {
            if (!formatFooter) {
                return footerValue;
            }
            if (footerValue == "Infinity") {
                return "0";
            }
            if (footerValue === 0 || footerValue) {
                return formatter(footerValue);
            }
            return "";
        },
        isFirst,
        isLast
    }
    return obj;
}
export function getThClass(header, styling) {
    if (header.column.columnDef.isFirst) {
        return styling.thead.th.first;
    }
    if (header.column.columnDef.isLast) {
        return styling.thead.th.last;
    }
    return styling.thead.th.middle;
}
export function getTdClass(cell, styling) {
    if (cell.column.columnDef.isFirst) {
        return styling.tbody.td.first;
    }
    if (cell.column.columnDef.isLast) {
        return styling.tbody.td.last;
    }
    return styling.tbody.td.middle;
}
export function getTfootClass(header, styling) {
    if (header.column.columnDef.isFirst) {
        return styling.tfoot.th.first;
    }
    if (header.column.columnDef.isLast) {
        return styling.tfoot.th.last;
    }
    return styling.tfoot.th.middle;
}