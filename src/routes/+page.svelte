<script>
	import { onMount } from 'svelte';
	import Chart from '$lib/components/charts/Chart.svelte';
	import HeadingTicker from '$lib/components/pages/home/HeadingTicker.svelte';
	import DatePicker from '$lib/components/layout/DatePicker.svelte';
	import { showLoader, hideLoader, TransformCurrencyValue } from '$lib/helpers/MiscHelpers';
	import { getTimeZoneAdjustedTimestampSeconds } from '$lib/helpers/UserHelpers';
	import { MarketingData, Workspace, CurrentRange, FullScreenView } from '$lib/store';
	import { get } from 'svelte/store';
	import { GetMarketingData, GetHomePageMetrics } from '$lib/services/MarketingDataService';
	import AttributionCard from '$lib/components/pages/home/AttributionCard.svelte';
	import { UpdateConnectorsStore } from '$lib/helpers/StoreHelpers';
	import { showDataWasUpdated, showMessage } from '$lib/services/ToastService';
	import { GetSeriesForConversionMetricsChart } from '$lib/helpers/MetricsChartsHelpers';
	import ConnectorsWrapper from '$lib/components/pages/home/ConnectorsWrapper.svelte';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';

	export let data;
	let CONVERSION_CHART_SERIES = [];
	let currentWorkspace;
	let metrics = null;
	let showDatePicker = false;

	onMount(async () => {
		FullScreenView.set(false);
		showLoader('Preparing your insights...');
		Workspace.subscribe(async (ws) => {
			try {
				if (!ws) {
					return;
				}
				if (data.auth_code) {
					goto(`/tracking/sources/tiktok/redirect?auth_code=${data.auth_code}`);
				}
				showLoader('Calculating metrics...');
				currentWorkspace = ws;
				let range = get(CurrentRange);
				await loadData(
					getTimeZoneAdjustedTimestampSeconds(range.start.unix()),
					getTimeZoneAdjustedTimestampSeconds(range.end.unix())
				);
			} catch (err) {
				console.error(err);
			} finally {
				hideLoader();
				await tick();
				showDatePicker = true;
			}
		});
	});
	async function loadData(start, end, isUpdate = false) {
		try {
			await getMetricsData(start, end);
		} catch (err) {
			console.log("couldn't get metrics");
		}

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

	async function getMetricsData(start, end) {
		CONVERSION_CHART_SERIES = [];
		metrics = await GetHomePageMetrics(currentWorkspace._id, start, end);
		if (metrics.isDefault) {
			showMessage('Server error', "Couldn't get metrics to show, please try later.", 'error');
			return;
		}
		CONVERSION_CHART_SERIES = GetSeriesForConversionMetricsChart(metrics);
	}
</script>

<div class="main">
	{#if showDatePicker}
		<div class="hf header">
			<div class="vf heading-text">
				<h2>Home</h2>
				<p>Here You can find comprehensive overview of all your connected platforms.</p>
			</div>
			<DatePicker
				on:rangeChanged={async (e) => {
					showMessage('Loading...', 'Updating marketing data and rebuilding metrics', 'info');
					await loadData(
						getTimeZoneAdjustedTimestampSeconds(e.detail.start),
						getTimeZoneAdjustedTimestampSeconds(e.detail.end),
						true
					);
				}}
			/>
		</div>
	{/if}

	{#if metrics}
		<div class="hf header-stats">
			<HeadingTicker
				field="Ad Spend"
				value={TransformCurrencyValue(metrics.adspendCum.value, 0)}
				period=""
			/>
			<HeadingTicker
				field="Revenue"
				value={TransformCurrencyValue(metrics.revenueCum.value, 0)}
				period=""
			/>
			<HeadingTicker
				field="ROAS"
				value={TransformCurrencyValue(metrics.roasCum.value, 2, false)}
				period=""
			/>
			<HeadingTicker field="CLV" value="N/A" period="" />
			<HeadingTicker field="Money saved" value="N/A" period="" />
			<HeadingTicker field="Postback accuracy" value="N/A" period="" />
		</div>

		<div class="hf header-graphs">
			<div class="glass card vf">
				<div class="vf stats">
					<h3>Conversion Metrics</h3>
					<p>Here are your Ad spend, profits and ROAS over all platforms</p>
					<div class="hf">
						<div class="vf value-container">
							<p class="value">{TransformCurrencyValue(metrics.adspendCum.value, 0)}</p>
							<p class="field">Ad Spend</p>
						</div>
						<div class="vf value-container">
							<p class="value">{TransformCurrencyValue(metrics.revenueCum.value, 0)}</p>
							<p class="field">Revenue</p>
						</div>
						<div class="vf value-container">
							<p class="value">{TransformCurrencyValue(metrics.roasCum.value, 2, false)}</p>
							<p class="field">ROAS</p>
						</div>
					</div>
				</div>
				{#if CONVERSION_CHART_SERIES.length > 0}
					<Chart
						id="conversion-metrics-chart"
						height={250}
						type="area"
						showGrid={false}
						showScales={false}
						sparkLine={true}
						series={CONVERSION_CHART_SERIES}
					/>
				{/if}
			</div>
		</div>
		<div class="vf attribution-graphs glass">
			<h2>Attribution Metrics</h2>
			<div class="graphs hf">
				<div class="vf half-wrapper">
					<AttributionCard
						id="5"
						heading="Traffic"
						value={TransformCurrencyValue(metrics.traficCum.value, 0, false)}
						data={metrics.trafic}
					/>
					<AttributionCard
						id="6"
						heading="Unique Traffic"
						value={TransformCurrencyValue(metrics.uniqueTrafficCum.value, 0, false)}
						data={metrics.uniqueTraffic}
					/>
				</div>
				<div class="vf half-wrapper">
					<AttributionCard id="1" heading="OneTrack Attributed Traffic" value="N/A" />
					<AttributionCard id="2" heading="Direct Traffic" value="N/A" />
				</div>
				<div class="vf half-wrapper">
					<AttributionCard id="3" heading="Attributed Order Value" value="N/A" />
					<AttributionCard id="4" heading="Direct Order Value" value="N/A" />
				</div>

				<div class="vf half-wrapper">
					<AttributionCard
						id="7"
						heading="Cost per order"
						value={TransformCurrencyValue(metrics.cpoAverage.value)}
						data={metrics.cpo}
					/>
					<AttributionCard
						id="8"
						heading="Average Order Value"
						value={TransformCurrencyValue(metrics.aovAverage.value)}
						data={metrics.aov}
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if metrics == null}
		<h3 style="text-align: center;margin-top:20%;">No metrics were found</h3>
	{/if}
	<ConnectorsWrapper />
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
	.main {
		padding: 17px 80px;
	}

	.header {
		justify-content: space-between;
		align-items: flex-end;
		& .heading-text {
			align-self: flex-start;
		}
	}
	.header-stats {
		margin-top: 20px;
		gap: 20px;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.header-graphs {
		margin-top: 20px;
		justify-content: space-between;
		& .card {
			height: 400px;
			width: 100%;
			justify-content: space-between;
			& .stats {
				padding: 1.5rem;
				padding-bottom: 0;

				& h3 {
					font-family: 'Montserrat';
					font-style: normal;
					font-weight: 600;
					font-size: 24px;
					line-height: 20px;
				}
				& p {
					font-family: 'Montserrat';
					font-style: normal;
					font-weight: 400;
					font-size: 14px;
					line-height: 20px;
				}
				& div {
					margin-top: 0.5rem;
					justify-content: space-between;
					flex-wrap: wrap;
					& .value-container {
						& .field {
							font-family: 'Montserrat';
							font-style: normal;
							font-weight: 600;
							font-size: 16px;
							line-height: 20px;
							margin-top: 1rem;
						}
						& .value {
							font-family: 'Montserrat';
							font-style: normal;
							font-weight: 700;
							font-size: 40px;
							line-height: 20px;
						}
					}
				}
			}
		}
	}
	.attribution-graphs {
		margin-top: 1.5rem;
		padding: 1.5rem;
		flex-wrap: wrap;
		h2 {
			font-size: 1rem;
		}
		& .graphs {
			justify-content: space-between;
			flex-wrap: wrap;

			& .half-wrapper {
				margin-top: 0.5rem;
				justify-content: space-between;
			}
		}
	}

	h2 {
		font-size: 24px;
		line-height: 20px;
		font-weight: 600;
	}
	p {
		font-size: 14px;
		line-height: 20px;
		font-weight: 400;
	}
	@media (max-width: 768px) {
		.header {
			flex-direction: column;
			& p {
				margin-bottom: 5vw;
			}
		}
		.header-stats {
			flex-wrap: wrap;
		}
		.header-graphs {
			margin-top: 1vh;
			justify-content: space-between;
			flex-wrap: wrap;
			& .card {
				height: 100%;
				justify-content: space-between;
			}
		}
		.half-wrapper {
			margin-top: 0 !important;
		}
		.main {
			padding: 10px 15px;
		}
	}
	@media (min-width: 769px) and (max-width: 992px) {
		.header {
			flex-direction: column;
			& p {
				margin-bottom: 5vw;
			}
		}
		.header-stats {
			flex-wrap: wrap;
		}
		.half-wrapper {
			margin-top: 0 !important;
		}
		.main {
			padding: 10px 20px;
		}
	}
</style>
