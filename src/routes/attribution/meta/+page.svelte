<script lang="ts">
	import moment from 'moment';
	import { onMount, tick, onDestroy } from 'svelte';
	import _ from 'underscore';
	import { Workspace, CurrentRange, CSVExportQue } from '$lib/store';
	import { GetStatsFromV2API } from '$lib/services/BackendRequestV2';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { get, type Unsubscriber } from 'svelte/store';
	import { showLoader, hideLoader } from '$lib/helpers/MiscHelpers';
	import { showDataWasUpdated, showMessage } from '$lib/services/ToastService';
	import { getTimeZoneAdjustedTimestampSeconds } from '$lib/helpers/UserHelpers';
	import DatePicker from '$lib/components/layout/DatePicker.svelte';
	import SelectionDropDowns from '$lib/components/pages/meta/SelectionDropDowns.svelte';
	import GridWrapper from '$lib/components/pages/meta/GridWrapperTab.svelte';
	import AttributionDataCard from '$lib/components/pages/meta/AttributionDataCard.svelte';
	import { GridDataTypes } from '$lib/helpers/ComponentsHelpers';
	import { handleUpdatedCSVQue } from '$lib/helpers/CSVHelpers';
	import { openModal } from 'svelte-modals';
	import { loadRows } from '$lib/helpers/ComponentsHelpers';
	import metaExportModel from '$lib/components/pages/meta/metaExportModel.svelte';

	function handleOpen() {
		openModal(metaExportModel, {});
	}

	const loadingText = 'Preparing your Meta metrics...';
	let showDataInTabularForm = true;
	//tab switching logic
	let showCampaigns = true;
	let showAdSets = false;
	let showAds = false;

	let workspaceId: string;
	let showDropDowns = false;

	let CampaignsSource = null;
	let AdSetsSource = null;
	let AdsSource = null;

	let CampaignsList = [];
	let AdSetsList = [];
	let AdsList = [];

	let distinctsAccounts = [];
	let distinctCampaigns = [];
	let distinctAdSets = [];
	let distinctAds = [];

	let renderedCampaigns = [];
	let renderedAdsets = [];
	let renderedAds = [];

	let unsubWorkspace: Unsubscriber;
	let unsubCSVQue: Unsubscriber;
	onMount(async () => {
		showLoader(loadingText);
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

		unsubCSVQue = CSVExportQue.subscribe((data) => {
			if (!data) {
				return;
			}
			let refreshQue = false;
			if (data.metaCampaignsSelected) {
				handleUpdatedCSVQue(loadRows(CampaignsSource).data, 'meta_campaigns');
				refreshQue = true;
			}
			if (data.metaAdSetsSelected) {
				handleUpdatedCSVQue(loadRows(AdSetsSource).data, 'meta_adsets');
				refreshQue = true;
			}
			if (data.metaAdsSelected) {
				handleUpdatedCSVQue(loadRows(AdsSource).data, 'meta_ads');
				refreshQue = true;
			}
			if (refreshQue) {
				CSVExportQue.set(null);
			}
		});
	});

	onDestroy(() => {
		if (unsubWorkspace) {
			unsubWorkspace();
		}
		if (unsubCSVQue) {
			unsubCSVQue();
		}
	});

	function cleanPreviousPlaceholders() {
		renderedCampaigns = [];
		renderedAdsets = [];
		renderedAds = [];
		distinctsAccounts = [];
		distinctCampaigns = [];
		distinctAdSets = [];
		distinctAds = [];
	}
	async function loadData(startDate, endDate, isUpdate = false) {
		try {
			showLoader(loadingText);
			cleanPreviousPlaceholders();
			let stats = await GetStatsFromV2API(
				workspaceId,
				'meta',
				moment.unix(startDate),
				moment.unix(endDate),
				'14d'
			);

			if (!stats.campaigns || !stats.adsets || !stats.ads) {
				showMessage(
					'Processing error',
					'Available data for selected range is not compatible. Please contact support.',
					'error',
					5000
				);
				CampaignsSource = [];
				AdSetsSource = [];
				AdsSource = [];
				return;
			}

			showDropDowns = false;
			let campDataHandler = handleCampaigns(stats.campaigns);
			let adsetDataHandler = handleAdSets(stats.adsets);
			let adsDataHandler = handleAds(stats.ads);
			await Promise.all([campDataHandler, adsetDataHandler, adsDataHandler]);
			if (isUpdate) {
				showDataWasUpdated('Marketing data is updated');
			}
		} catch (err) {
			console.error(err);
		} finally {
			hideLoader();
			showDropDowns = true;
		}
	}
	async function handleCampaigns(data) {
		try {
			CampaignsSource = null;
			distinctsAccounts = _.uniq(data.map((x) => x.accountName)).map((x) => {
				return {
					name: x,
					state: true
				};
			});
			for (let ac of distinctsAccounts) {
				let acData = data.find((x) => x.accountName == ac.name);
				ac.id = acData.accountId;
			}
			distinctCampaigns = data.map((x) => {
				return {
					name: `${x.campaignName} (${x.campaignId})`,
					state: true,
					id: x.campaignId,
					accountId: x.accountId
				};
			});

			renderedCampaigns = distinctCampaigns;
			data = data.sort(function (a, b) {
				return b.adSpend - a.adSpend;
			});
			CampaignsList = data;
			CampaignsSource = CampaignsList;
		} catch (err) {
			console.error(err);
		}
	}
	async function handleAdSets(data) {
		try {
			AdSetsSource = null;
			distinctAdSets = data.map((x) => {
				return {
					name: `${x.adSetName} (${x.adSetId})`,
					state: true,
					id: x.adSetId,
					campaignId: x.campaignId
				};
			});
			renderedAdsets = distinctAdSets;
			data = data.sort(function (a, b) {
				return b.adSpend - a.adSpend;
			});
			AdSetsList = data;
			AdSetsSource = AdSetsList;
		} catch (err) {
			console.error(err);
		}
	}
	async function handleAds(data) {
		try {
			AdsSource = null;
			distinctAds = data.map((x) => {
				return {
					name: `${x.adName} (${x.adId})`,
					state: true,
					id: x.adId,
					campaignId: x.campaignId,
					adSetId: x.adSetId
				};
			});
			renderedAds = distinctAds;
			data = data.sort(function (a, b) {
				return b.adSpend - a.adSpend;
			});
			AdsList = data;
			AdsSource = AdsList;
		} catch (err) {
			console.error(err);
		}
	}
	async function filterCampaigns() {
		for (let campaign of distinctCampaigns) {
			let cmpData = renderedCampaigns.find((x) => x.id == campaign.id);
			if (cmpData) {
				campaign.state = cmpData.state;
			}
		}
		CampaignsSource = null;
		await tick();
		let selectedAccountIds = distinctsAccounts.filter((x) => x.state).map((x) => x.id);
		renderedCampaigns = distinctCampaigns.filter((x) => selectedAccountIds.includes(x.accountId));
		let selectedCampaignIds = renderedCampaigns.filter((x) => x.state).map((x) => x.id);
		let filteredCampaigns = CampaignsList.filter((x) => selectedCampaignIds.includes(x.campaignId));
		CampaignsSource = filteredCampaigns;
		filterAdSets();
	}
	async function filterAdSets() {
		for (let adset of distinctAdSets) {
			let adsetData = renderedAdsets.find((x) => x.id == adset.id);
			if (adsetData) {
				adset.state = adsetData.state;
			}
		}
		AdSetsSource = null;
		await tick();
		let selectedCampaignIds = renderedCampaigns.filter((x) => x.state).map((x) => x.id);
		renderedAdsets = distinctAdSets.filter((x) => selectedCampaignIds.includes(x.campaignId));
		let selectedAdSetIds = renderedAdsets.filter((x) => x.state).map((x) => x.id);
		let filtered = AdSetsList.filter((x) => selectedAdSetIds.includes(x.adSetId));
		AdSetsSource = filtered;
		filterAds();
	}
	async function filterAds() {
		for (let ad of distinctAds) {
			let adData = renderedAds.find((x) => x.id == ad.id);
			if (adData) {
				ad.state = adData.state;
			}
		}
		AdsSource = null;
		await tick();
		let selectedAdSetIds = renderedAdsets.filter((x) => x.state).map((x) => x.id);
		renderedAds = distinctAds.filter((x) => selectedAdSetIds.includes(x.adSetId));
		let selectedAdIds = renderedAds.filter((x) => x.state).map((x) => x.id);
		let filtered = AdsList.filter((x) => selectedAdIds.includes(x.adId));
		AdsSource = filtered;
	}
	function handleAllSelection(event, list) {
		for (let elm of list) {
			elm.state = event.detail;
		}
	}
</script>

<div class="px-0.5 flex flex-col flex-1 gap-3  min-h-110">
	<div class="flex flex-wrap justify-between gap-3 w-full relative z-20">
		<div class="flex flex-col gap-3 w-full">
			<div class="space-y-1">
				<h2 class="text-xl text-white leading-none font-medium flex gap-1">Meta - Ads Dashboard</h2>
				<p class="text-xs leading-none">
					Here You can find comprehensive overview of all your meta ads.
				</p>
			</div>
			<div class="flex flex-col sm:flex-row flex-wrap gap-2 w-full items-start">
				{#if showDropDowns}
					<div class="flex flex-wrap gap-2 flex-1">
						<SelectionDropDowns
							id="account"
							title="Account Name"
							list={distinctsAccounts}
							on:onSelectionChanged={() => {
								filterCampaigns();
							}}
							on:allSelectionChanged={(e) => {
								handleAllSelection(e, distinctsAccounts);
								distinctsAccounts = distinctsAccounts;
							}}
						/>
						<SelectionDropDowns
							id="campaign"
							title="Campaign Name"
							list={renderedCampaigns}
							on:onSelectionChanged={filterCampaigns}
							on:allSelectionChanged={(e) => {
								handleAllSelection(e, renderedCampaigns);
								renderedCampaigns = renderedCampaigns;
							}}
						/>
						<SelectionDropDowns
							id="adset"
							title="Ad Set Name"
							list={renderedAdsets}
							on:onSelectionChanged={filterAdSets}
							on:allSelectionChanged={(e) => {
								handleAllSelection(e, renderedAdsets);
								renderedAdsets = renderedAdsets;
							}}
						/>
						<SelectionDropDowns
							id="adselection"
							title="Ad Name"
							list={renderedAds}
							on:onSelectionChanged={filterAds}
							on:allSelectionChanged={(e) => {
								handleAllSelection(e, renderedAds);
								renderedAds = renderedAds;
							}}
						/>
					</div>
					<div class="flex gap-3">
						<DatePicker
							on:rangeChanged={async (e) => {
								await loadData(
									getTimeZoneAdjustedTimestampSeconds(e.detail.start),
									getTimeZoneAdjustedTimestampSeconds(e.detail.end),
									true
								);
							}}
						/>

						<div class="isolate inline-flex rounded shadow-sm border border-white/10 bg-white/10">
							<button
								type="button"
								class="relative inline-flex items-center rounded w-10 justify-center px-2 py-2 text-sm font-medium "
								class:active-view={showDataInTabularForm}
								class:in-active-view={!showDataInTabularForm}
								on:click={() => (showDataInTabularForm = true)}
							>
								<span class="sr-only">List View</span>
								<Icon data={Icons.listViewIcon} class="w-4 h-4 " color="currentColor" />
							</button>
							<button
								type="button"
								class="relative -ml-px inline-flex items-center rounded w-10 justify-center  px-2 py-2 text-sm font-medium "
								class:active-view={!showDataInTabularForm}
								class:in-active-view={showDataInTabularForm}
								on:click={() => {
									//showDataInTabularForm = false;
									showMessage('Grid view is coming soon!', '', 'info');
								}}
							>
								<span class="sr-only">Grid View</span>
								<Icon data={Icons.gridViewIcon} class="w-4 h-4  " color="currentColor" />
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Grid Data -->
	<div class="flex-col flex gap-6 flex-1 pt-3" class:hidden={showDataInTabularForm}>
		<div class="relative ">
			<select
				class="appearance-none border border-white/10 ease-in-out duration-500 bg-white/10 text-white py-2.5 px-3 focus:bg-color block w-60 font-medium text-left placeholder-white focus:outline-none rounded-md shadow-sm focus:border-blue focus:ring-blue text-sm outline-none leading-none peer invalid:border-red invalid:text-red"
			>
				<option>Sort by: ROAS</option>
				<option>Sort by: ROAS</option>
				<option>Sort by: ROAS</option>
				<option>Sort by: ROAS</option>
			</select>
		</div>
		<!-- scroll-card-meta add this class if need scrollbar -->
		<div class="flex-1 on-hover-scroll overflow-auto">
			<div
				class="max-w-sm mx-auto sm:max-w-inherit sm:grid sm:grid-cols-2 ml:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5"
			>
				<AttributionDataCard />
			</div>
		</div>
	</div>

	<!-- Table Data -->
	<div class="flex-col flex-1 max-h-full relative" class:hidden={!showDataInTabularForm}>
		<div class="-mb-px flex flex-wrap space-x-3 pr-20 sm:pr-54 mt-5">
			<button
				type="button"
				class="relative sm:flex-1 flex before:absolute before:backdrop-blur-2.5xl before:rounded-t before:inset-0 rounded-t group after:absolute after:inset-0 after:rounded-t after:shadow-metaInside {showCampaigns
					? 'bg-color before:bg-blue-box before:opacity-20 after:opacity-0 before:shadow-none'
					: 'before:opacity-80 before:bg-dropdown after:opacity-100 shadow-dropdown'}"
				on:click|preventDefault={() => {
					showAdSets = false;
					showAds = false;
					showCampaigns = true;
				}}
			>
				<span
					class="text-white inline-flex items-center justify-start flex-1 gap-2 px-5 py-3 font-semibold text-sm relative z-10"
				>
					<Icon data={Icons.folderIcon} class="w-3 h-3 text-grey-2" stroke="transparent" />
					<span class="hidden sm:inline-flex">Campaigns</span>
				</span>
			</button>
			<button
				type="button"
				class="relative sm:flex-1 flex before:absolute before:backdrop-blur-2.5xl before:rounded-t before:inset-0 rounded-t group after:absolute after:inset-0 after:rounded-t after:shadow-metaInside {showAdSets
					? 'bg-color before:bg-blue-box before:opacity-20 after:opacity-0 before:shadow-none'
					: 'before:opacity-80 before:bg-dropdown after:opacity-100 shadow-dropdown'}"
				on:click|preventDefault={() => {
					showAds = false;
					showCampaigns = false;
					showAdSets = true;
				}}
			>
				<span
					class="text-white inline-flex items-center justify-start flex-1 gap-2 px-5 py-3 font-semibold text-sm relative z-10"
				>
					<Icon data={Icons.fourDotsIcon} class="w-3 h-3 text-grey-2" stroke="transparent" />
					<span class="hidden sm:inline-flex">Ad Sets</span>
				</span>
			</button>
			<button
				type="button"
				class="relative sm:flex-1 flex before:absolute before:backdrop-blur-2.5xl before:rounded-t before:inset-0 rounded-t group after:absolute after:inset-0 after:rounded-t after:shadow-metaInside {showAds
					? 'bg-color before:bg-blue-box before:opacity-20 after:opacity-0 before:shadow-none'
					: 'before:opacity-80 before:bg-dropdown after:opacity-100 shadow-dropdown'}"
				on:click|preventDefault={() => {
					showCampaigns = false;
					showAdSets = false;
					showAds = true;
				}}
			>
				<span
					class="text-white inline-flex items-center justify-start flex-1 gap-2 px-5 py-3 font-semibold text-sm relative z-10"
				>
					<Icon data={Icons.progressIcon} class="w-3 h-3 text-grey-2" stroke="transparent" />
					<span class="hidden sm:inline-flex">Ads</span>
				</span>
			</button>

			<div class="flex items-start">
				<button
					type="button"
					on:click={handleOpen}
					class="relative flex before:absolute before:backdrop-blur-2.5xl before:rounded before:inset-0 rounded group after:absolute after:inset-0 after:rounded before:bg-dropdown after:opacity-100 after:border after:border-grey "
				>
					<span
						class="text-white inline-flex items-center justify-start p-2.5 font-semibold text-sm relative z-10 "
					>
						<Icon data={Icons.download} class="w-5 h-4" stroke="transparent" />
						<span class="sr-only">Download/Export</span>
					</span>
				</button>
			</div>
		</div>
		<div class="flex-col flex flex-1 max-h-full ">
			{#if showCampaigns}
				<GridWrapper
					Source={CampaignsSource}
					id="campaigns-meta-tab"
					gridType={GridDataTypes.campaigns}
				/>
			{:else if showAdSets}
				<GridWrapper Source={AdSetsSource} id="adsets-meta-tab" gridType={GridDataTypes.adsets} />
			{:else}
				<GridWrapper Source={AdsSource} id="ads-meta-tab" gridType={GridDataTypes.ads} />
			{/if}
		</div>
	</div>
</div>

<style>
	.active-view {
		@apply bg-white/20 text-white/70;
	}
	.in-active-view {
		@apply text-white/20;
	}
</style>
