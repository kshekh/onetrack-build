<script>
	import FunnelStat from '$lib/components/pages/overview/FunnelStat.svelte';
	import OverviewTable from '$lib/components/pages/overview/OverviewTable.svelte';
	import DatePicker from '$lib/components/layout/DatePicker.svelte';
	import { onMount } from 'svelte';
	import { showLoader, hideLoader } from '$lib/helpers/MiscHelpers';
	import { MarketingData, Workspace, CurrentRange } from '$lib/store';
	import { GetMarketingData } from '$lib/services/MarketingDataService';
	import { UpdateConnectorsStore } from '$lib/helpers/StoreHelpers';
	import { getTimeZoneAdjustedTimestampSeconds } from '$lib/helpers/UserHelpers';
	import { showDataWasUpdated, showMessage } from '$lib/services/ToastService';
	import { get } from 'svelte/store';

	const FUNNEL_CHART_SERIES_1 = [
		{
			name: 'Meta',
			data: [
				[0, 100],
				[1, 90],
				[2, 80]
			]
		},
		{
			name: 'Google',
			data: [
				[0, 90],
				[1, 80],
				[2, 70]
			]
		}
	];
	const FUNNEL_CHART_SERIES_2 = [
		{
			name: 'Meta',
			data: [
				[0, 80],
				[1, 70],
				[2, 60]
			]
		},
		{
			name: 'Google',
			data: [
				[0, 70],
				[1, 60],
				[2, 50]
			]
		}
	];
	const FUNNEL_CHART_SERIES_3 = [
		{
			name: 'Meta',
			data: [
				[0, 60],
				[1, 50],
				[2, 40]
			]
		},
		{
			name: 'Google',
			data: [
				[0, 50],
				[1, 40],
				[2, 30]
			]
		}
	];
	const FUNNEL_CHART_SERIES_4 = [
		{
			name: 'Meta',
			data: [
				[0, 40],
				[1, 30],
				[2, 20]
			]
		},
		{
			name: 'Google',
			data: [
				[0, 30],
				[1, 20],
				[2, 10]
			]
		}
	];

	let currentWorkspace;
	onMount(async () => {
		showLoader('Populating overview insights...');
		Workspace.subscribe(async (ws) => {
			try {
				if (!ws) {
					return;
				}
				currentWorkspace = ws;
				let mkdata = get(MarketingData);
				if (mkdata) {
					return;
				}
				let range = get(CurrentRange);
				await loadMarketingData(
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
	async function loadMarketingData(start, end, isUpdate = false) {
		let marketingData = await GetMarketingData(
			currentWorkspace._id,
			'meta',
			'campaign',
			start,
			end
		);
		let flattenMarketingData = marketingData.flat(2);
		flattenMarketingData = flattenMarketingData.sort(function (a, b) {
			return a.timestamp - b.timestamp;
		});
		UpdateConnectorsStore(currentWorkspace, flattenMarketingData);
		MarketingData.set(flattenMarketingData);
		if (isUpdate) {
			showDataWasUpdated('Marketing data is updated');
		}
	}
</script>

<div class="main">
	<div class="hf header ">
		<div class="vf ">
			<h2>Overview</h2>
			<p>Here You can find comprehensive overview of all your connected platforms.</p>
		</div>
		<DatePicker
			on:rangeChanged={async (e) => {
				showMessage('Loading...', 'Updating marketing data', 'info');
				await loadMarketingData(
					getTimeZoneAdjustedTimestampSeconds(e.detail.start),
					getTimeZoneAdjustedTimestampSeconds(e.detail.end),
					true
				);
			}}
		/>
	</div>
	<div class="glass main-funnel vf">
		<h2>Funnel - Coming soon</h2>
		<div class="hf funnel-stats-wrapper">
			<FunnelStat id="1" series={FUNNEL_CHART_SERIES_1} height={200} />
			<FunnelStat id="2" series={FUNNEL_CHART_SERIES_2} height={150} funnelLevel="50.0%" />
			<FunnelStat id="3" series={FUNNEL_CHART_SERIES_3} height={100} funnelLevel="25.0%" />
			<FunnelStat id="4" series={FUNNEL_CHART_SERIES_4} height={50} funnelLevel="12.5%" />
		</div>
	</div>
	<div class="data-grid glass">
		<OverviewTable />
	</div>
</div>

<style lang="scss">
	html:root {
		--bg-color: #111a2d;
		--bg-color-light: transparent;
		--text-color: rgb(255, 255, 255);
		--text-color-light: rgb(183, 183, 183);
		--blue-heading-color: rgb(25, 120, 211);
		--default-font: 'Montserrat';
		--data-grid-header-footer-bg: #181c2a;
		--blue-flash-color: linear-gradient(104.64deg, #007df2 0%, #46a6ff 100%);
		--blue-flash-color-shadow: 0px 0px 20px rgba(0, 125, 242, 0.8);
		--good-state: radial-gradient(circle, #11c1a2, #0db396, #08a68a, #04987e, #008b72);
		--bad-state: radial-gradient(circle, #e14343, #d83938, #cf2f2d, #c62322, #bd1616);
		--okay-state: radial-gradient(63.52% 63.52% at 68.03% 31.76%, #eeb85f 0%, #cf8916 100%);
		--data-grid-top-offset: 330px;
	}
	.glass {
		border-radius: 1rem;
		backdrop-filter: blur(100px);
		-webkit-backdrop-filter: blur(100px);
		background: linear-gradient(
			116.02deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.02) 100%
		);
		box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1), inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.1),
			inset 0.5px 0.5px 1px rgba(0, 0, 0, 0.1);
	}
	.vf {
		display: flex;
		flex-direction: column;
	}
	.hf {
		display: flex;
		flex-direction: row;
	}
	h2 {
		font-size: revert;
		font-weight: revert;
	}
	.main {
		padding: 18px 54px 18px 54px;
	}
	.header {
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 1rem;
	}
	.main-funnel {
		padding: 1rem;

		& .funnel-stats-wrapper {
			justify-content: space-around;
			margin-top: 1rem;
			flex-wrap: wrap;
		}
	}
	.data-grid {
		margin-top: 1rem;
		padding: 1rem;
		overflow-x: scroll;
	}
	.data-grid::-webkit-scrollbar {
		background: transparent;
		border-radius: 10px;
	}
	h2 {
		font-size: 1.5rem;
	}
	p {
		font-size: 0.9rem;
	}
	@media (max-width: 768px) {
		.header {
			flex-direction: column;
			& .vf {
				margin-bottom: 10px;
				align-self: flex-start;
			}
		}
	}
	@media (min-width: 769px) and (max-width: 992px) {
		.header {
			flex-direction: column;
			& .vf {
				margin-bottom: 10px;
				align-self: flex-start;
			}
		}
	}
</style>
