<script>
	import { hideLoader } from '$lib/helpers/MiscHelpers';
	import { onMount, onDestroy } from 'svelte';
	import { Workspace } from '$lib/store';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { openModal } from 'svelte-modals';
	import GoogleAdsModal from '$lib/components/pages/connections/GoogleAdsModal.svelte';
	import MetaFormModal from '$lib/components/pages/connections/MetaFormModal.svelte';
	
	function handleOpen() {
		openModal(MetaFormModal, {});
	}

	function googleAds() {
		openModal(GoogleAdsModal, {});
	}

	let unsub;
	onMount(() => {
		unsub = Workspace.subscribe(async (ws) => {
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
		if (unsub) {
			unsub();
		}
	});
</script>

<main class="max-w-screen-xl mx-auto w-full flex flex-col space-y-4 xl:px-5 flex-1 ">
	<div class="shrink-0 flex items-center">
		<button
			class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue sm:min-w-24 w-10 sm:w-auto sm:px-3 2xl:px-5 p-1.5 2xl:p-3 text-sm font-semibold :outline-none ease-in-out duration-300 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 before:inset-0 before:absolute hover:text-white text-white before:opacity-100 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-green after:absolute hover:shadow-glow-green hover:before:opacity-0"
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
					Connect a new destination
				</h1>
				<div class="flex-1 flex justify-start w-full">
					<div class="relative w-full sm:max-w-md xl:pr-11 flex items-center">
						<label for="search" class="sr-only">Search</label>
						<div
							class="pointer-events-none absolute inset-y-0 left-0 w-10 hidden xs:flex items-center justify-center z-10"
						>
							<Icon data={Icons.searchIcon} stroke="transparent" class="w-4 h-4  text-white" />
						</div>

						<div
							class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl w-full"
						>
							<input
								class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 xs:pl-10 outline-none leading-none peer invalid:border-red invalid:text-red h-11 w-full"
								type="search"
								id="search"
								placeholder="Search"
								name="search"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="flex md:flex-nowrap flex-wrap gap-1.5 sm:gap-3">
				<button
					type="button"
					class="cursor-pointer flex flex-1 items-center justify-start rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass-2 after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none text-sm sm:text-base "
				>
					<span class="relative z-10 block truncate px-5 p-2">All</span>
				</button>
				<button
					type="button"
					class="cursor-pointer flex flex-1 items-center justify-start rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass-2 after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none text-sm sm:text-base "
				>
					<span class="relative z-10 block truncate px-5 p-2">Ad Platform</span>
				</button>
				<button
					type="button"
					class="cursor-pointer flex flex-1 items-center justify-start rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass-2 after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none text-sm sm:text-base "
				>
					<span class="relative z-10 block truncate px-5 p-2">E-Commerce</span>
				</button>
				<button
					type="button"
					class="cursor-pointer flex flex-1 items-center justify-start rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass-2 after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none text-sm sm:text-base "
				>
					<span class="relative z-10 block truncate px-5 p-2">E-Mail</span>
				</button>
				<button
					type="button"
					class="cursor-pointer flex flex-1 items-center justify-start rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass-2 after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none text-sm sm:text-base "
				>
					<span class="relative z-10 block truncate px-5 p-2">Website Builder</span>
				</button>
				<button
					type="button"
					class="cursor-pointer flex flex-1 items-center justify-start rounded-md leading-snug relative ease-in-out duration-300 h-11 text-white before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass-2 before:ease-in-out before:duration-300 before:absolute before:inset-0 before:rounded-md hover:before:opacity-0 after:bg-blue-box after:opacity-0 after:backdrop-blur-2.5xl after:shadow-glass-2 after:ease-in-out after:duration-300 after:absolute after:inset-0 hover:after:opacity-100 after:rounded-md outline-none text-sm sm:text-base "
				>
					<span class="relative z-10 block truncate px-5 p-2">CRM</span>
				</button>
			</div>
		</div>

		<div
			class="xl:grid-cols-5 md:grid-cols-4 xs:grid-cols-3 mv:grid-cols-2 mv:grid flex flex-col xs:gap-4 gap-3"
		>
			<button
				type="button"
				on:click={handleOpen}
				class="outline-none bg-transparent rounded-md relative before:absolute before:bg-glass before:backdrop-blur-2.5xl p-5 before:rounded-md before:shadow-glass-dropdown before:opacity-30 before:inset-0 space-y-2 flex justify-center items-center hover:before:shadow-glow-blue before:ring-1 before:ring-transparent hover:before:ring-blue before:ease-in-out before:duration-300 ease-in-out duration-300 hover:before:opacity-50"
			>
				<div
					class="relative z-10 flex flex-col gap-4 text-center h-40 justify-center items-center shrink-0"
				>
					<div class="w-20 h-20 flex justify-center items-center">
						<Icon data={Icons.meta} stroke="transparent" class="w-20 h-20 " />
					</div>
					<p class="text-white text-base">Meta</p>
				</div>
			</button>

			<button
				type="button"
				on:click={googleAds}
				class="outline-none bg-transparent rounded-md relative before:absolute before:bg-glass before:backdrop-blur-2.5xl p-5 before:rounded-md before:shadow-glass-dropdown before:opacity-30 before:inset-0 space-y-2 flex justify-center items-center hover:before:shadow-glow-blue before:ring-1 before:ring-transparent hover:before:ring-blue before:ease-in-out before:duration-300 ease-in-out duration-300 hover:before:opacity-50"
			>
				<div
					class="relative z-10 flex flex-col gap-4 text-center h-40 justify-center items-center shrink-0"
				>
					<div class="w-20 h-20 flex justify-center items-center">
						<img src={Icons.google} alt="google" class="w-20 h-20 aspect-square object-cover" />
					</div>
					<p class="text-white text-base">Google</p>
				</div>
			</button>
		</div>
	</div>
</main>
