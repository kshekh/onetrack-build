<script>
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Connectors } from '$lib/store';
	import { TransformCurrencyValue, percentageFormatter } from '$lib/helpers/MiscHelpers';
	import { Icons } from '$lib/resources/IconResources';
</script>

<h2>Platform Dashboard</h2>

<table>
	<tr>
		<th>Platform</th>
		<th>Ad spend</th>
		<th>Revenue</th>
		<th>ROAS</th>
		<th>Orders</th>
		<th>AOV</th>
		<th>CLV</th>
		<th>CTR</th>
		<th>CPC</th>
		<th>CPATC</th>
		<th>CPIC</th>
		<th>CPO</th>
		<th>CPM</th>
		<th>Status</th>
	</tr>
	{#each $Connectors as row}
		<tr>
			<td>
				<div class="logo-wrapper glass">
					{#if row.platform == 'meta'}
						<Icon data={Icons.meta} width="25" height="25" color="transparent" />
					{:else if row.platform == 'google'}
						<Icon data={Icons.google} width="25" height="25" color="transparent" />
					{/if}
				</div>
			</td>
			<td> {`${TransformCurrencyValue(row.adSpendTotal, 2, true)}`} </td>
			<td>N/A</td>
			<td>{`${row.roas}`} </td>
			<td>{`${row.orders}`}</td>
			<td>{`${TransformCurrencyValue(row.averageOrderValue, 2, true)}`}</td>
			<td>N/A</td>
			<td>{`${percentageFormatter((Number(row.ctr) - 1).toFixed(2))}`}</td>
			<td>{`${TransformCurrencyValue(row.cpc, 2, true)}`}</td>
			<td>{`${TransformCurrencyValue(row.cpatc, 2, true)}`}</td>
			<td>{`${TransformCurrencyValue(row.cpic, 2, true)}`}</td>
			<td>{`${TransformCurrencyValue(row.cpo, 2, true)}`}</td>
			<td>{`${TransformCurrencyValue(row.cpm, 2, true)}`}</td>

			<td><div class="status">good</div></td>
		</tr>
	{/each}
</table>

<style lang="scss">
	h2 {
		font-family: 'Montserrat';
		font-style: normal;
		font-weight: 600;
		font-size: 24px;
		line-height: 20px;
	}
	.logo-wrapper {
		width: 50px;
		height: 50px;
		display: flex;
		justify-items: center;
		justify-content: center;
		border-radius: 50%;
		align-items: center;
	}
	td,
	th {
		text-align: left;
	}
	th {
		font-family: 'Montserrat';
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 20px;
		padding-bottom: 0.1rem;
	}
	td {
		font-family: 'Montserrat';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 20px;
		color: var(--text-color-light);
		padding: 0.5rem 0;
		border-top: 0.5px solid var(--text-color-light);
	}

	table {
		margin-top: 1rem;
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}
	.status {
		background-image: var(--okay-state);
		color: var(--text-color);
		border-radius: 12px;
		text-align: center;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		align-content: center;
		font-family: 'Montserrat';
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 20px;
		/* identical to box height, or 125% */

		text-align: center;
		text-transform: uppercase;
	}
	@media (max-width: 768px) {
		table {
			table-layout: fixed;
			min-width: 1200px;
			overflow: auto;
		}
		* {
			scrollbar-width: auto;
			scrollbar-color: var(--blue-heading-color);
		}
		*::-webkit-scrollbar {
			width: 16px;
		}

		*::-webkit-scrollbar-track {
			background: transparent;
		}

		*::-webkit-scrollbar-thumb {
			background-color: var(--blue-heading-color);
			border-radius: 10px;
			border: none;
		}
	}
	@media (min-width: 769px) and (max-width: 992px) {
		table {
			table-layout: fixed;
			min-width: 1200px;
		}
	}
</style>
