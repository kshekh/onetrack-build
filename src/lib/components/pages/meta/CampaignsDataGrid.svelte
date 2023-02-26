<script>
	import { tick } from 'svelte';
	import {
		loadRows,
		GridDataTypes,
		defaultGridStyling as styling
	} from '$lib/helpers/ComponentsHelpers';
	import TanStackDataTable from '$lib/components/layout/TanStackDataTable.svelte';

	export let CampaignsSource = null;
	let columns = [];
	let data = [];

	$: {
		renderRows(CampaignsSource);
	}
	async function renderRows(source) {
		if (!source) {
			return;
		}
		data = [];
		await tick();
		let response = loadRows(source, GridDataTypes.campaigns);
		columns = response.columns;
		data = response.data;
	}
</script>

{#if data && data.length > 0}
	<TanStackDataTable {data} {columns} {styling} id="meta-campaigns-tanstack-datagrid" />
{/if}
