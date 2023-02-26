<script lang="ts">
	import { onMount } from 'svelte';
	import _ from 'underscore';
	import Chart from '$lib/components/charts/DonutChart.svelte';
	import { percentageFormatter, TransformCurrencyValue, getSum } from '$lib/helpers/MiscHelpers';
	import EventsHeaderCard from './EventsHeaderCard.svelte';
	import { CurrentEventsFilter, CurrentRange } from '$lib/store';
	import { get } from 'svelte/store';

	export let events = [];
	export let arePurchaseEvents;

	let adGroups = [];
	let typeGroups = [];
	let chartLabels = [];
	let chartValues = [];
	let previousFilter = '';

	onMount(() => {
		manipulateEventForStats(events);
	});

	function manipulateEventForStats(data) {
		if (!data) {
			return;
		}

		if (arePurchaseEvents) {
			data = data.sort(function (a, b) {
				return a.purchase.timestamp - b.purchase.timestamp;
			});
		} else {
			data = data.sort(function (a, b) {
				return a.lead.timestamp - b.lead.timestamp;
			});
		}

		data = data.map((x) => {
			let isAttributed = true;
			if (!x.purchase) {
				x.purchase = {};
			}
			if (!x.touchpoints || Object.keys(x.touchpoints[0]).length === 0) {
				isAttributed = false;
				x.touchpoints = [{}];
			}
			if (arePurchaseEvents) {
				return {
					...x.purchase,
					...x.touchpoints[0],
					isAttributed
				};
			} else {
				return {
					...x.lead,
					...x.touchpoints[0],
					isAttributed
				};
			}
		});
		let typeGroupNames = _.uniq(data.map((t) => t?.type).filter(Boolean)).filter((x) => x != 'ad');
		let attributedAds = data.filter((x) => x.type == 'ad' && x.adId);
		let adGroupNames = _.uniq(data.filter((x) => x.type == 'ad').map((x) => x.source)).filter(
			(x) => x != 'facebook' && x != 'instagram'
		);
		adGroups = adGroupNames.map((x) => {
			if (x == 'meta') {
				return {
					name: x,
					source: data.filter(
						(t) =>
							t.type == 'ad' && (t.source == x || t.source == 'facebook' || t.source == 'instagram')
					),
					attributedAdsCount: attributedAds.filter(
						(t) => t.source == x || t.source == 'facebook' || t.source == 'instagram'
					).length
				};
			}
			return {
				name: x,
				source: data.filter((t) => t.type == 'ad' && t.source == x),
				attributedAdsCount: attributedAds.filter((t) => t.source == x).length
			};
		});

		adGroups = TransformData(adGroups, attributedAds.length);
		typeGroups = typeGroupNames.map((x) => {
			const source = data.filter((t) => t.type && t.type == x);
			return {
				name: x,
				source
			};
		});

		typeGroups.push({
			name: 'Unattributed',
			source: data.filter((x) => x.isAttributed == false)
		});

		typeGroups = TransformData(typeGroups, attributedAds.length);

		chartLabels = [...typeGroups.map((x) => x.name), ...adGroupNames];
		chartValues = [...typeGroups.map((x) => x.count), ...adGroups.map((x) => x.count)];
	}

	function TransformData(list, attributedAdsLength) {
		let range = get(CurrentRange);
		let rangeDiff = Number(range.end.diff(range.start, 'days'));
		for (let item of list) {
			item.percentage = percentageFormatter(item.attributedAdsCount / attributedAdsLength);
			item.count = item.source.length;
			if (arePurchaseEvents) {
				item.revenue = TransformCurrencyValue(getSum(item.source.map((x) => x.orderValue)));
			} else {
				item.revenue = 'N/A';
			}

			let chartData = [];
			item.source.forEach((g) => {
				let td = new Date(g.timestamp);
				let date;
				if (rangeDiff < 4) {
					date = new Date(td.getFullYear(), td.getMonth(), td.getDate(), td.getHours());
				} else {
					date = new Date(td.getFullYear(), td.getMonth(), td.getDate());
				}
				if (arePurchaseEvents) {
					chartData.push({
						day: date.valueOf(),
						order: g.orderValue
					});
				} else {
					chartData.push({ day: date.valueOf(), order: 1 });
				}
			});
			let chartCleanedData = [];
			_.uniq(chartData.map((x) => x.day)).forEach((d) => {
				chartCleanedData.push([
					d,
					Number(getSum(chartData.filter((x) => x.day == d).map((x) => x.order)))
				]);
			});
			if (chartCleanedData.length == 1) {
				chartCleanedData = [[0, 0], ...chartCleanedData];
			}
			item.chartSeries = [
				{
					name: item.name,
					data: chartCleanedData
				}
			];
		}
		return list;
	}

	function handleCardFilter(e: { detail: { name: string } }) {
		let filter = e.detail.name;
		if (previousFilter === filter) {
			CurrentEventsFilter.set(null);
			previousFilter = '';
			return;
		}
		CurrentEventsFilter.set(filter);
		previousFilter = filter;
	}

	$: {
		manipulateEventForStats(events);
	}
</script>

{#if events && events.length > 0}
	<div class="flex flex-col md:flex-row gap-5 py-2">
		<div
			class="md:w-72 xl:max-w-sm xl:w-full bg-transparent relative before:absolute before:bg-glass before:backdrop-blur-2.5xl p-5 before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 space-y-2 flex flex-col"
		>
			<div class="relative z-10">
				<h2 class="font-semibold leading-none">Distribution</h2>
				<div class="w-full flex-1 flex items-center justify-center">
					<Chart
						id="meta-events"
						height="350px"
						width="350px"
						series={chartValues}
						labels={chartLabels}
						showLegend={true}
					/>
				</div>
			</div>
		</div>
		<div class="w-full bg-transparent pr-2 py-1 relative before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 gap-4 grid grid-cols-12 max-w-full" >
			<div class="overflow-x-auto max-w-full on-hover-scroll flex-1 col-span-12 z-20 relative pr-2">
				<div class="flex gap-4 p-4 pr-0 ">
					{#each adGroups as adGroup}
						<EventsHeaderCard
							data={adGroup}
							id={adGroup.name}
							on:filter={handleCardFilter}
							type="ad"
						/>
					{/each}
					{#each typeGroups as typeGroup}
						<EventsHeaderCard data={typeGroup} id={typeGroup.name} on:filter={handleCardFilter} />
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
