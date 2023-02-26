<script lang="ts">
	import { hideLoader } from '$lib/helpers/MiscHelpers';
	import { onMount, onDestroy } from 'svelte';
	import { Workspace } from '$lib/store';
	import { closeModal, openModal } from 'svelte-modals';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import AddMetaAuth from '$lib/components/pages/connections/AddMetaAuth.svelte';
	import AddGoogleAuth from '$lib/components/pages/connections/AddGoogleAuth.svelte';
	import AddTikTokAuth from '$lib/components/pages/connections/AddTikTokAuth.svelte';
	import AddDomainConnector from '$lib/components/pages/connections/AddDomainConnector.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { goto } from '$app/navigation';
	import {} from 'jquery';
	type platformItem = {
		name: string;
		component: any;
		type: string;
		tags: string[];
	};
	const filters = ['', 'Ad Platform', 'E-Commerce', 'E-Mail', 'Website Builder', 'CRM'];
	const platforms: platformItem[] = [
		{
			name: 'Meta',
			component: AddMetaAuth,
			type: 'Ad Platform',
			tags: ['meta', 'ads', 'facebook', 'instagram']
		},
		{
			name: 'Google',
			component: AddGoogleAuth,
			type: 'Ad Platform',
			tags: ['google', 'gAds', 'google ads']
		},
		{
			name: 'TikTok',
			component: AddTikTokAuth,
			type: 'Ad Platform',
			tags: ['tik', 'tok', 'tiktok ads']
		}

		//TODO: enable this when working
		//AddDomainConnector
	];
	let list: platformItem[] = platforms;
	let endSubscription: Unsubscriber;
	let currentFilter = '';

	function domainNextStepOpen() {
		openModal(sourceModal, {});
	}

	onMount(() => {
		endSubscription = Workspace.subscribe(async (ws) => {
			try {
				if (!ws) {
					return;
				}
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
	function runFilter(filter: string) {
		currentFilter = filter;
		if (filter == '') {
			list = platforms;
		} else {
			list = platforms.filter((x) => x.type == currentFilter);
		}
	}
	function runSearch(term: string) {
		term = term.toLowerCase();
		if (!term || term == '') {
			list = platforms;
		} else {
			list = platforms.filter(
				(x) => x.name.toLowerCase().includes(term) || x.tags.some((y) => y.toLowerCase() == term)
			);
		}
	}
	function handleInputEvent(e: InputEvent) {
		const target = e.target as HTMLInputElement;
		runSearch(target.value);
	}
</script>

<main class="max-w-screen-xl mx-auto w-full flex flex-col space-y-4 xl:px-5 flex-1 ">
	<div class="shrink-0 flex items-center">
		<button
			class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue sm:min-w-24 w-10 sm:w-auto sm:px-3 2xl:px-5 p-1.5 2xl:p-3 text-sm font-semibold :outline-none ease-in-out duration-300 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 before:inset-0 before:absolute hover:text-white text-white before:opacity-100 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-green after:absolute hover:shadow-glow-green hover:before:opacity-0"
			on:click={() => {
				goto('/tracking/connections');
			}}
		>
			<span class="relative z-10 inline-flex items-center gap-2">
				<span class="text-xl"
					><Icon data={Icons.AngleLeft} stroke="transparent" class="w-2.5 " /></span
				><span class="whitespace-nowrap hidden sm:inline">Back to Connections</span>
			</span>
		</button>
	</div>
	<!-- Top Section -->
	<div class="space-y-5">
		<div class="space-y-3">
			<div class="relative w-full flex flex-col sm:flex-row items-center flex-wrap gap-3 md:gap-9">
				<h1 class="text-xl text-white leading-none font-medium flex gap-1 flex-1 max-w-sm">
					Connect a new Account
				</h1>
				<div class="flex-1 flex justify-start w-full">
					<div class="relative w-full sm:max-w-md xl:pr-11 flex items-center">
						<label for="search" class="sr-only">Search</label>
						<div class="pointer-events-none absolute inset-y-0 left-0 w-10 hidden xs:flex items-center justify-center z-10" >
							<Icon data={Icons.searchIcon} stroke="transparent" class="w-4 h-4  text-white" />
						</div>
						<div class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl w-full" >
							<input
								class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 xs:pl-10 outline-none leading-none peer invalid:border-red invalid:text-red h-11 w-full"
								type="search"
								id="search"
								placeholder="Search"
								name="search"
								on:input={handleInputEvent}
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="flex md:flex-nowrap flex-wrap gap-1.5 sm:gap-3">
				{#each filters as filter}
					<button
						type="button"
						class="cursor-pointer flex flex-1 items-center justify-start rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none text-sm sm:text-base "
						on:click={() => {
							runFilter(filter);
						}}
						class:bg-blue-box={currentFilter == filter}
					>
						<span class="relative z-10 block truncate px-5 p-2"
							>{`${filter == '' ? 'All' : filter}`}</span
						>
					</button>
				{/each}
			</div>
		</div>

		<div
			class="xl:grid-cols-5 md:grid-cols-4 xs:grid-cols-3 mv:grid-cols-2 mv:grid flex flex-col xs:gap-4 gap-3"
		>
			{#each list as platform}
				<svelte:component this={platform.component} />
			{/each}
		</div>
	</div>
</main>
