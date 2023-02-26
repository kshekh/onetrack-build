<script lang="ts">
	import Chart from '$lib/components/charts/Chart.svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { goto } from '$app/navigation';
	import { showMessage } from '$lib/services/ToastService';
	import { CurrentEventsFilter } from '$lib/store';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const AVAILABLE_ATTRIBUTION_PAGES = ['meta'];

	export let data: any;
	export let id: string;
	export let type = 'other';

	function gotoAttributionPage(pageName: string) {
		if (AVAILABLE_ATTRIBUTION_PAGES.some((x) => x == pageName)) {
			goto(`/attribution/${pageName}`);
			return;
		}
		showMessage(
			`"${pageName[0].toUpperCase()}${pageName.slice(
				1,
				pageName.length
			)}" attribution details page is being developed. It will be available soon.`,
			'',
			'info'
		);
	}
	function handleSingleClick(name: string) {
		dispatch('filter', {
			name
		});
	}
</script>

<div
	class="min-w-40 bg-transparent relative hover:before:shadow-glow-blue before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass before:opacity-80 before:inset-0 before:transition-all before:ease-in-out before:duration-500"
	class:before:shadow-glow-blue={$CurrentEventsFilter == data.name}
>
	<div class="relative z-10 overflow-hidden flex flex-col rounded-3xl">
		<div
			class="p-3 pb-0 flex-1 space-y-1.5 cursor-pointer"
			on:dblclick={() => {
				gotoAttributionPage(data.name);
			}}
			on:click={() => {
				handleSingleClick(data.name);
			}}
		>
			<div class="flex justify-between">
				<p class="text-sm font-bold text-white flex gap-2 capitalize">
					<Icon
						data={Icons[data.name] ?? Icons.targetIcon}
						stroke="transparent"
						class="text-white w-4"
					/><span class="tracking-wider">{data.name}</span>
				</p>
				{#if type == 'ad'}
					<div
						on:click={() => {
							gotoAttributionPage(data.name);
						}}
					>
						<Icon data={Icons.redirectOut} stroke="transparent" class="w-4" />
					</div>
				{/if}
			</div>

			<div class="flex justify-between py-1">
				<div class="flex flex-col gap-1">
					<p class="text-sm font-light leading-none">Ad Level</p>
					{#if type == 'ad'}
						<p class="font-bold text-lg text-left leading-none">{data.percentage}</p>
					{:else}
						<p class="font-bold text-lg text-left leading-none">N/A</p>
					{/if}
				</div>
				<div class="flex flex-col gap-1">
					<p class="text-sm font-light leading-none">Platform</p>
					<p class="font-bold text-lg text-left leading-none">N/A</p>
				</div>
			</div>

			<div class="rounded-full flex items-stretch h-1.5 bg-blue-flash overflow-hidden">
				<span class="bg-pink-flash block rounded-l-full" style="width:{data.percentage}" />
			</div>

			<div class="flex justify-between py-1">
				<div class="space-y-1">
					<p class="text-sm font-light leading-none">Count</p>
					<p class="font-bold text-lg text-left leading-none">{data.count}</p>
				</div>
				<div class="space-y-1">
					<p class="text-sm font-light leading-none">Revenue</p>
					<p class="font-bold text-lg text-left leading-none">{data.revenue}</p>
				</div>
			</div>
		</div>
		<!-- Area Chart will be here -->
		<div class="h-10 rounded-b-3xl overlfow-hidden -mt-1">
			<Chart
				id="chart-card-{id}"
				type="area"
				height="100%"
				showGrid={false}
				showScales={false}
				sparkLine={true}
				series={data.chartSeries}
				showTooltip={false}
				border="1px"
			/>
		</div>
	</div>
</div>
