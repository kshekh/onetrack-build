<script lang="ts">
	import moment, { type Moment } from 'moment';
	import { getJquery } from '$lib/helpers/jQueryHelper';
	import { GetDatePicker } from '$lib/local-packages/DatePicker';
	import { onMount, onDestroy } from 'svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { createEventDispatcher } from 'svelte';
	import { CurrentRange } from '$lib/store';
	import type { Unsubscriber } from 'svelte/store';

	const dispatch = createEventDispatcher();
	let jq: JQueryStatic;
	let unsub: Unsubscriber;
	let firstRender = true;
	onMount(async () => {
		jq = await getJquery();
		GetDatePicker(moment, jq);
		unsub = CurrentRange.subscribe((x) => {
			if (!x) {
				return;
			}
			if (firstRender) {
				setup(x.start, x.end);
				firstRender = false;
			}
		});
	});
	function setup(startProp: Moment, endProp: Moment) {
		const options = {
			ranges: {
				Today: [moment().startOf('day'), moment()],
				Yesterday: [
					moment().subtract(1, 'days').startOf('day'),
					moment().subtract(1, 'days').endOf('day')
				],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment()],
				'Last Month': [
					moment().subtract(1, 'month').startOf('month'),
					moment().subtract(1, 'month').endOf('month')
				]
			},
			opens: 'left',
			start: startProp,
			end: endProp
		};
		jq('#datepicker-input').daterangepicker(
			options,
			function (start: moment.Moment, end: moment.Moment, label: string) {
				CurrentRange.set({ start, end });
				dispatch('rangeChanged', {
					start: start.unix(),
					end: end.unix()
				});
			}
		);
	}
	onDestroy(() => {
		if (unsub) {
			unsub();
		}
	});
</script>

<div
	class="relative group cursor-default text-sm bg-transparent flex gap-2 items-center text-left focus:outline-none border border-grey rounded-md sm:border-0 sm:rounded-none"
>
	<span class="sm:absolute inset-y-0 h-8 w-10 sm:h-auto flex items-center justify-center sm:justify-start left-3">
		<Icon data={Icons.calendarIcon} stroke="transparent" class="w-5" />
	</span>
	<input
		type="text"
		id="datepicker-input"
		class="appearance-none cursor-default bg-white/10 pl-10 pr-8 py-2 text-center text-sm hidden sm:block w-60 relative z-10 focus:outline-none outline-none ease-in-out duration-300 border border-white/10 hover:border-blue rounded-md leading-none focus:border-blue focus:ring-0"
	/>
	<span class="hidden absolute inset-y-0 w-10 sm:flex items-center justify-end right-2">
		<Icon data={Icons.triangleSymbolIcon} stroke="transparent" class="w-3 hidden sm:block" />
	</span>
	<button
		class="sm:hidden absolute inset-0 z-10"
		on:click={() => {
			document.getElementById('datepicker-input')?.click();
		}}><span class="sr-only hover:text-blue">Date Picker</span></button
	>
</div>
