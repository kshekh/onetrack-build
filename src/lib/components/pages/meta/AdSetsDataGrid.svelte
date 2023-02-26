<script>
	import { tick } from 'svelte';
	import {
		loadRows,
		GridDataTypes,
		defaultGridStyling as styling
	} from '$lib/helpers/ComponentsHelpers';
	import TanStackDataTable from '$lib/components/layout/TanStackDataTable.svelte';

	export let AdSetsSource = null;
	let columns = [];
	let data = [];

	$: {
		renderRows(AdSetsSource);
	}
	async function renderRows(source) {
		if (!source) {
			return;
		}
		data = [];
		await tick();
		let response = loadRows(source, GridDataTypes.adsets);
		columns = response.columns;
		data = response.data;
	}
</script>

{#if data && data.length > 0}
	<TanStackDataTable {data} {columns} {styling} id="meta-adsets-tanstack-datagrid" />
{/if}
