<script lang="ts">
	import TanStackDataTable from '$lib/components/layout/TanStackDataTable.svelte';
	import moment from 'moment';
	import { onMount, onDestroy, tick } from 'svelte';
	import { currencyFormatter, getSum } from '$lib/helpers/MiscHelpers';
	import { GetColumnDefinition } from '$lib/helpers/TableHelpers';
	import { defaultGridStyling as styling } from '$lib/helpers/ComponentsHelpers';
	import { CSVExportQue, CurrentEventsFilter } from '$lib/store';
	import { handleUpdatedCSVQue } from '$lib/helpers/CSVHelpers';
	import type { Unsubscriber } from 'svelte/store';

	export let arePurchaseEvents = true;
	export let data = [];

	let columns: [] = [];
	let gridData: [] = [];
	let filter: string | null = null;
	let endSubscription: Unsubscriber;
	let endFilterSubscription: Unsubscriber;

	onMount(() => {
		endSubscription = CSVExportQue.subscribe((data) => {
			if (!data) {
				return;
			}
			if (data.allEventsExportSelected) {
				handleUpdatedCSVQue(gridData, `${arePurchaseEvents ? 'order' : 'lead'}_events `);
			}
		});
		endFilterSubscription = CurrentEventsFilter.subscribe((filterValue) => {
			if (filterValue != filter) {
				filter = filterValue;
			}
		});
	});

	onDestroy(() => {
		if (endSubscription) {
			endSubscription();
		}
		if (endFilterSubscription) {
			endFilterSubscription();
		}
		CSVExportQue.set(null);
	});

	$: {
		loadRows(data, filter);
	}

	async function loadRows(events, filter) {
		try {
			gridData = [];
			await tick();
			let extractedData = {};
			if (arePurchaseEvents) {
				extractedData = extractPurchaseEventRows(events);
			} else {
				extractedData = extractLeadsEventRows(events);
			}
			if (filter) {
				gridData = extractedData.filter((x) => x.filter == filter);
			} else {
				gridData = extractedData;
			}
			columns = createColumns(gridData);
		} catch (err) {
			console.error(err);
		}
	}

	function extractPurchaseEventRows(data) {
		let events = [];
		data = data.sort(function (a, b) {
			return b.purchase.timestamp - a.purchase.timestamp;
		});

		for (let event of data) {
			let obj = {
				timestamp: event.purchase.timestamp,
				email: event.purchase.email ?? '',
				visitorId: event.purchase.visitorId ?? '',
				orderId: event.purchase.orderId ?? ''
			};
			if (event.touchpoints && Object.keys(event.touchpoints[0]).length > 0) {
				obj = {
					...obj,
					campaignName: event.touchpoints[0].campaignName ?? '',
					adId: event.touchpoints[0].adId ?? '',
					source: event.touchpoints[0].source ?? '',
					clickId: event.touchpoints[0].clickId ?? '',
					medium: event.touchpoints[0].medium ?? '',
					from: event.touchpoints[0].from ?? '',
					referer: event.touchpoints[0].referer ?? '',
					type: event.touchpoints[0].type ?? ''
				};
			} else {
				obj = {
					...obj,
					campaignName: '',
					adId: '',
					source: '',
					clickId: '',
					medium: '',
					from: '',
					referer: '',
					type: 'Unattributed'
				};
			}
			let orderVal = 0;
			if (event.purchase.orderValue) {
				orderVal = Number(event.purchase.orderValue);
			}
			obj = {
				...obj,
				orderVal,
				filter: obj.type == 'ad' ? obj.source : obj.type
			};
			events.push(obj);
		}
		return events;
	}

	function extractLeadsEventRows(data) {
		let events = [];
		data = data.sort(function (a, b) {
			return b.lead.timestamp - a.lead.timestamp;
		});

		for (let event of data) {
			let obj = {
				timestamp: event.lead.timestamp,
				email: event.lead.email ?? '',
				visitorId: event.lead.visitorId ?? ''
			};
			if (event.touchpoints && Object.keys(event.touchpoints[0]).length > 0) {
				obj = {
					...obj,
					campaignName: event.touchpoints[0].campaignName ?? '',
					adId: event.touchpoints[0].adId ?? '',
					source: event.touchpoints[0].source ?? '',
					clickId: event.touchpoints[0].clickId ?? '',
					medium: event.touchpoints[0].medium ?? '',
					from: event.touchpoints[0].from ?? '',
					referer: event.touchpoints[0].referer ?? '',
					type: event.touchpoints[0].type ?? ''
				};
			} else {
				obj = {
					...obj,
					campaignName: '',
					adId: '',
					source: '',
					clickId: '',
					medium: '',
					from: '',
					referer: '',
					type: 'Unattributed'
				};
			}
			obj = {
				...obj,
				filter: obj.type == 'ad' ? obj.source : obj.type
			};
			events.push(obj);
		}
		return events;
	}

	function createColumns(data) {
		if (arePurchaseEvents) {
			return [
				GetColumnDefinition(
					'timestamp',
					'Date',
					'none',
					`Summary (${data.length})`,
					(cell) => moment.unix(cell / 1000).format('DD.MM.YYYY HH:mm '),
					true,
					false,
					false
				),
				GetColumnDefinition('email', 'E-mail'),
				GetColumnDefinition('visitorId', 'OneTrack ID'),
				GetColumnDefinition('orderId', 'Order ID'),
				GetColumnDefinition('campaignName', 'Campaign name'),
				GetColumnDefinition('adId', 'Ad ID'),
				GetColumnDefinition('source', 'Source'),
				GetColumnDefinition('clickId', 'Click ID'),
				GetColumnDefinition('medium', 'Medium'),
				GetColumnDefinition('from', 'From'),
				GetColumnDefinition('referer', 'Referrer'),
				GetColumnDefinition('type', 'Type'),
				GetColumnDefinition(
					'orderVal',
					'Order Value',
					'none',
					getSum(data.map((x) => x.orderVal)),
					currencyFormatter,
					false,
					true
				)
			];
		} else {
			return [
				GetColumnDefinition(
					'timestamp',
					'Date',
					'none',
					`Summary (${data.length})`,
					(cell) => moment.unix(cell / 1000).format('DD.MM.YYYY HH:mm '),
					true,
					false,
					false
				),
				GetColumnDefinition('email', 'E-mail'),
				GetColumnDefinition('visitorId', 'OneTrack ID'),
				GetColumnDefinition('campaignName', 'Campaign Name'),
				GetColumnDefinition('adId', 'Ad ID'),
				GetColumnDefinition('source', 'Source'),
				GetColumnDefinition('clickId', 'Click ID'),
				GetColumnDefinition('medium', 'Medium'),
				GetColumnDefinition('from', 'From'),
				GetColumnDefinition('referer', 'Referrer'),
				GetColumnDefinition('type', 'Type')
			];
		}
	}
</script>

{#if gridData && gridData.length > 0 && columns.length > 0}
	<TanStackDataTable data={gridData} {columns} {styling} id="events-main-page-grid" />
{/if}
