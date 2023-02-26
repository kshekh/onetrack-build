<script>
	import { tick } from 'svelte';
	import {
		loadRows,
		GridDataTypes,
		defaultGridStyling as styling
	} from '$lib/helpers/ComponentsHelpers';
	import TanStackDataTable from '$lib/components/layout/TanStackDataTable.svelte';

	export let AdsSource = null;
	let columns = [];
	let data = [];

	$: {
		renderRows(AdsSource);
	}
	async function renderRows(source) {
		if (!source) {
			return;
		}
		data = [];
		await tick();
		let response = loadRows(source, GridDataTypes.ads);
		columns = response.columns;
		data = response.data;
	}
</script>

{#if data && data.length > 0}
	<TanStackDataTable {data} {columns} {styling} id="meta-ads-tanstack-datagrid" />
{/if}
