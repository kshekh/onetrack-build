<script lang="ts">
	import AddAccountModel from '$lib/components/pages/connections/AddAccountModel.svelte';
	import AdSourceTokenModel from '$lib/components/pages/connections/AdSourceTokenModel.svelte';
	import ConnectionInfoCard from '$lib/components/pages/connections/ConnectionInfoCard.svelte';
	import { hideLoader } from '$lib/helpers/MiscHelpers';
	import { onMount, onDestroy } from 'svelte';
	import { Workspace } from '$lib/store';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { openModal } from 'svelte-modals';
	import type { Unsubscriber } from 'svelte/store';
	import type { ConnectorDataType } from '$lib/types/Types';

	let endSubscription: Unsubscriber;
	let connectors: ConnectorDataType[] = [];
	let showOnlyDestinations = false;
	let showOnlySources = false;
	let refreshToken = false;

	onMount(() => {
		endSubscription = Workspace.subscribe(async (ws) => {
			try {
				if (!ws) {
					return;
				}
				showOnlyDestinations = false;
				showOnlySources = false;
				connectors = ws.connectors;
			} catch (err) {
				console.error(err);
			} finally {
				hideLoader();
			}
		});
	});

	onDestroy(() => {
		if (endSubscription) {
			endSubscription();
		}
	});

	function handleOpen() {
		openModal(AddAccountModel, {});
	}
	function AdSoruceTokenHandle() {
		openModal(AdSourceTokenModel, {});
	}

	function loadConnectors() {
		if (!$Workspace) {
			return;
		}
		if (showOnlyDestinations) {
			connectors = $Workspace.connectors.filter((x) => x.type == 'postback');
		} else if (showOnlySources) {
			connectors = $Workspace.connectors.filter((x) => x.type == 'marketing-data');
		} else {
			connectors = $Workspace.connectors;
		}
	}
</script>

<main class="max-w-screen-xl mx-auto w-full flex flex-col space-y-5 xl:px-5 flex-1 relative ">
	<!-- Top Section -->
	<div class="space-y-3">
		<h1 class="text-xl text-white leading-none font-medium flex gap-1">
			{connectors.length} connected Accounts
		</h1>
		<div class="flex justify-between items-center relative">
			<Icon
				data={Icons.metaLogoIcon}
				class="shrink-0 invisible sr-only"
				height="20px"
				width="20px"
				stroke="transparent"
				color="currentColor"
			/>
			<div class="flex gap-1.5 sm:gap-3">
				<button
					type="button"
					class="cursor-pointer rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none sm:w-44 text-sm sm:text-base "
					class:bg-blue-box={showOnlySources}
					on:click={() => {
						showOnlyDestinations = false;
						showOnlySources = !showOnlySources;
						loadConnectors();
					}}
				>
					<span class="relative z-10 flex items-center justify-start ">
						<span class="pointer-events-none absolute inset-y-0 left-4 flex items-center ">
							<Icon data={Icons.output} stroke="transparent" class="w-4 sm:w-5 transitions " />
						</span>
						<span class="relative z-10 block truncate pr-4 p-2 pl-10 sm:pl-12">Sources</span>
					</span>
				</button>
				<button
					type="button"
					class="cursor-pointer rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none sm:w-44 text-sm sm:text-base "
					class:bg-blue-box={showOnlyDestinations}
					on:click={() => {
						showOnlySources = false;
						showOnlyDestinations = !showOnlyDestinations;
						loadConnectors();
					}}
				>
					<span class="relative z-10 flex items-center justify-start ">
						<span class="pointer-events-none absolute inset-y-0 left-4 flex items-center ">
							<Icon data={Icons.input} stroke="transparent" class="w-4 sm:w-5 transitions " />
						</span>
						<span class="relative z-10 block truncate pr-4 p-2 pl-10 sm:pl-12">Destinations</span>
					</span>
				</button>
			</div>
			<div class="shrink-0 flex items-center xs:gap-4 gap-3">
				{#if refreshToken}
					<button
						on:click={AdSoruceTokenHandle}
						class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-red sm:min-w-24 w-10 sm:w-auto sm:px-3 2xl:px-5 p-2 2xl:p-2.5 text-sm font-semibold :outline-none ease-in-out duration-300 before:bg-radial-red before:rounded-full before:ease-in-out before:duration-300 before:inset-0 before:absolute hover:text-white text-white before:opacity-100 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-green after:absolute hover:shadow-glow-green hover:before:opacity-0"
					>
						<span class="relative z-10 inline-flex items-center gap-1">
							<span class="text-xl"
								><Icon data={Icons.exclamation} stroke="transparent" class="w-4" /></span
							>
							<span class="whitespace-nowrap hidden sm:inline">Refresh Tokens</span>
						</span>
					</button>
				{:else}
					<button
						on:click={AdSoruceTokenHandle}
						class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue sm:min-w-24 w-10 sm:w-auto sm:px-3 2xl:px-5 p-2 2xl:p-2.5 text-sm font-semibold :outline-none ease-in-out duration-300 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 before:inset-0 before:absolute hover:text-white text-white before:opacity-100 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-green after:absolute hover:shadow-glow-green hover:before:opacity-0"
						class:opacity-50={true}
						disabled
					>
						<span class="relative z-10 inline-flex items-center gap-1 leading-none">
							<span class="text-xl leading-none">+</span>
							<span class="whitespace-nowrap hidden sm:inline">Refresh Tokens</span>
						</span>
					</button>
				{/if}

				<button
					on:click={handleOpen}
					class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue sm:min-w-24 w-10 sm:w-auto sm:px-3 2xl:px-5 p-2 2xl:p-2.5 text-sm font-semibold :outline-none ease-in-out duration-300 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 before:inset-0 before:absolute hover:text-white text-white before:opacity-100 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-green after:absolute hover:shadow-glow-green hover:before:opacity-0"
				>
					<span class="relative z-10 inline-flex items-center gap-1">
						<span class="text-xl leading-none">+</span><span
							class="whitespace-nowrap hidden sm:inline">Add New Account</span
						>
					</span>
				</button>
			</div>
		</div>
	</div>
	<!-- Card Section -->
	<div class="flex-1">
		<!-- On Desktop -->

		<div class="flex flex-col sm:grid-cols-2 xl:grid-cols-3 sm:grid gap-4 ">
			{#each connectors as connector}
				<ConnectionInfoCard {connector} />
			{/each}
		</div>

		<!-- On Tablet -->

		<!-- On Mobile -->
	</div>

	<!-- Pagination -->
	<nav class="flex items-center justify-end pt-10 hidden">
		<div class="flex items-center justify-end gap-2">
			<div class="flex gap-2 items-center">
				<span class="inline-flex items-center text-sm font-medium text-white">Items per page:</span>
				<select
					class="pagination-select w-10 outline-none focus:ring-0 leading-none border-0 border-b border-grey rounded-0 appearance-none text-white bg-transparent p-0 text-sm font-medium"
				>
					<option>9</option>
				</select>
			</div>
			<div class="hidden md:flex items-center">
				<a
					href="/#"
					class="inline-flex items-center w-8 h-8 justify-center rounded-full hover:bg-white/10 text-sm font-medium text-white ease-in-out duration-300"
					>1</a
				>
				<span class="inline-flex items-center text-sm font-medium text-white">-</span>
				<a
					href="/#"
					class="inline-flex items-center w-8 h-8 justify-center rounded-full hover:bg-white/10 text-sm font-medium text-white ease-in-out duration-300"
					>2</a
				>
				<span class="inline-flex items-center text-sm font-medium text-white ">of 2</span>
			</div>
			<div class="flex gap-1 flex-1 justify-end items-center">
				<a
					href="/#"
					class="inline-flex relative items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-sm font-medium text-white ease-in-out duration-300"
				>
					<span class="sr-only">Previous</span>
					<Icon data={Icons.AngleLeft} class="w-2.5 h-2.5" color="currentColor" />
				</a>
				<a
					href="/#"
					class="inline-flex relative items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-sm font-medium text-white ease-in-out duration-300"
				>
					<span class="sr-only">Next</span>
					<Icon data={Icons.AngleRight} class="w-2.5 h-2.5" color="currentColor" />
				</a>
			</div>
		</div>
	</nav>
	<!--End Pagination -->
</main>
