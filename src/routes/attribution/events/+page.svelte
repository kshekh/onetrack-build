<script lang="ts">
	import moment from 'moment';
	import { onMount, tick, onDestroy } from 'svelte';
	import { get, type Unsubscriber } from 'svelte/store';
	import DatePicker from '$lib/components/layout/DatePicker.svelte';
	import { Workspace, CurrentRange, CSVExportQue } from '$lib/store';
	import { showLoader, hideLoader, sleep } from '$lib/helpers/MiscHelpers';
	import { showDataWasUpdated, showMessage } from '$lib/services/ToastService';
	import { getTimeZoneAdjustedTimestampSeconds } from '$lib/helpers/UserHelpers';
	import { GetEventsDataFromV2API } from '$lib/services/BackendRequestV2';
	import EventsDataGrid from '$lib/components/pages/events/EventsDataGrid.svelte';
	import EventsHeader from '$lib/components/pages/events/EventsHeader.svelte';
	import EventsAndLeadsToggle from '$lib/components/pages/events/EventsAndLeadsToggle.svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';

	let workspaceId: string;
	let arePurchaseEvents = true;
	let events: null | [] = null;
	let unsubWorkspace: Unsubscriber;

	onMount(async () => {
		showLoader('Preparing your attributed events metrics...');
		unsubWorkspace = Workspace.subscribe(async (ws) => {
			try {
				if (!ws) {
					return;
				}
				workspaceId = ws._id;
				let range = get(CurrentRange);
				await loadData(
					getTimeZoneAdjustedTimestampSeconds(range.start.unix()),
					getTimeZoneAdjustedTimestampSeconds(range.end.unix())
				);
			} catch (err) {
				console.error(err);
			} finally {
				hideLoader();
			}
		});
	});

	onDestroy(() => {
		if (unsubWorkspace) {
			unsubWorkspace();
		}
	});

	async function selectionCallback(val) {
		if (arePurchaseEvents === val) {
			return;
		}
		arePurchaseEvents = val;
		let range = get(CurrentRange);
		await tick();
		await loadData(
			getTimeZoneAdjustedTimestampSeconds(range.start.unix()),
			getTimeZoneAdjustedTimestampSeconds(range.end.unix())
		);
	}

	async function loadData(startDate, endDate, isUpdate = false) {
		try {
			showLoader('Loading captured events...');
			await sleep(1000);
			events = null;
			await tick();
			let response = null;
			if (arePurchaseEvents) {
				response = await GetEventsDataFromV2API(
					workspaceId,
					moment.unix(startDate),
					moment.unix(endDate),
					'purchase',
					'14d'
				);
			} else {
				response = await GetEventsDataFromV2API(
					workspaceId,
					moment.unix(startDate),
					moment.unix(endDate),
					'lead',
					'14d'
				);
			}
			events = response;
			if (isUpdate) {
				showDataWasUpdated('Attribution events are updated');
			}
		} catch (err) {
			console.error(err);
			hideLoader();
			if (events == null || events.length == 0) {
				showMessage('Error while fetching data', err, 'error', 4000);
			}
		} finally {
			hideLoader();
			if (events == null || events.length == 0) {
				showMessage('No Data to show', 'No captured events to show', 'error', 7000);
			}
		}
	}

	function handleCSVDownload() {
		CSVExportQue.set({
			allEventsExportSelected: true
		});
	}
</script>

<div class="px-0.5 space-y-4 flex flex-col flex-1 min-h-110">
	<div class="space-y-4">
		<div class="flex flex-wrap md:flex-nowrap justify-between gap-3 w-full">
			<div class="space-y-1">
				<h2 class="text-xl text-white leading-none font-medium flex items-center gap-2">
					<span>Events</span>
					<span class="leading-none relative flex items-center">
						<Icon data={Icons.infoIcon} stroke="transparent" class="w-5" />
					</span>
				</h2>
				<p class="text-xs leading-none">
					Get a comprehensive look at {arePurchaseEvents ? 'orders' : 'leads'} captured and processed
					with OneTrack Analytics engine.
				</p>
			</div>

			<div class="flex items-center w-full xs:w-auto">
				<div class="flex items-stretch gap-2 justify-start xs:justify-end">
					<EventsAndLeadsToggle
						on:selectionChange={(e) => {
							selectionCallback(e.detail.isPurchaseSelected);
						}}
						/>
					<button
						type="button"
						on:click={handleCSVDownload}
						class="relative flex before:absolute before:backdrop-blur-2.5xl before:rounded before:inset-0 rounded group after:absolute after:inset-0 after:rounded before:bg-dropdown after:opacity-100 after:border after:border-grey "
						>
						<span
							class="text-white inline-flex items-center justify-start p-2.5 font-semibold text-sm relative z-10 "
						>
							<Icon data={Icons.download} class="w-5 h-5" stroke="transparent" />
							<span class="sr-only">Download/Export</span>
						</span>
					</button>
					<DatePicker
						on:rangeChanged={async (e) => {
							await loadData(
								getTimeZoneAdjustedTimestampSeconds(e.detail.start),
								getTimeZoneAdjustedTimestampSeconds(e.detail.end),
								true
							);
						}}
						/>
				</div>
			</div>
		</div>

		<EventsHeader {events} {arePurchaseEvents} />
	</div>

	<div class="flex flex-col flex-1  max-h-full">
		<div
			class="w-full flex-1 bg-transparent relative before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 max-w-full" >
		 <div class="rounded-3xl overflow-hidden w-full">
			<div
				class="overflow-auto w-full flex-1 rounded-3xl scrollbar scroll-card-event md:min-h-full relative z-20"
			>
				{#if events}
					<EventsDataGrid {arePurchaseEvents} data={events} />
				{/if}
			</div>
		</div>
		</div>
	</div>
</div>
