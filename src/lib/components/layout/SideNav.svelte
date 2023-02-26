<script lang="ts">
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import { menus } from '$lib/resources/SideNavResources';
	import { closeModal } from 'svelte-modals';

	export let hidden = true;
	const dispatch = createEventDispatcher();

	let title = 'Home';

	function gotoUrl(link: { href: string; title: string }) {
		title = link.title;
		dispatch('didRouting', { url: link.href });
		goto(link.href);
	}
	async function handleCloseClick() {
		hidden = true;
		await tick();
		closeModal();
	}
</script>

<svelte:head>
	<title>{title} - OneTrack</title>
</svelte:head>

<aside
	transition:slide
	class="md:w-64 flex-col max-h-full fixed inset-0 z-40 lg:flex "
	class:hidden
>
	<div class="fixed inset-0 bg-color opacity-50 lg:hidden" />

	<div
		class="flex flex-col flex-1 w-64 lg:w-auto max-w-full relative z-20 max-h-full min-h-screen bg-color lg:bg-transparent before:bg-glass before:shadow-glass before:absolute before:inset-0 before:opacity-20 before:backdrop-blur-2.5xl shadow-navbar lg:shadow-none"
	>
		<div class="lg:mx-5 flex justify-center items-stretch border-b border-grey gap-1 relative z-10">
			<h1 class="sr-only uppercase">OneTrack</h1>
			<button
				type="button"
				class="py-4 px-3 flex-1 flex justify-center items-center cursor-pointer outline-none"
				on:click|preventDefault={() => {
					gotoUrl({
						href: '/',
						title: 'Home'
					});
				}}
			>
				<Icon
					data={Icons.oneTrackLightGreyFullNameIcon}
					class="lg:h-10 h-7"
					fill="currentColor"
					stroke="currentColor"
				/>
			</button>
			<button
				class="border-l border-grey py-2 px-4 flex justify-center items-center lg:hidden outline-none"
				on:click={handleCloseClick}
			>
				<Icon data={Icons.crossIcon} class="w-6 h-6" color="currentColor" />
			</button>
		</div>

		<nav
			class="overflow-y-auto overflow-x-hidden on-hover-scroll no-scroll-track flex-1 px-5 py-3 gap-5 flex flex-col max-h-full relative z-10 "
		>
			{#each menus as menu}
				<section class="flex flex-col gap-3">
					{#if menu.heading != null}
						<h3 class="text-transparent bg-clip-text bg-radial-blue font-semibold uppercase">
							{menu.heading}
						</h3>
					{/if}
					<ul class="space-y-1">
						{#each menu.links as link}
							<li>
								<button
									type="button"
									class="py-2.5 pr-1 cursor-pointer w-full flex items-center justify-start rounded leading-snug relative pl-12 transition-all ease-in-out duration-300 disabled:opacity-25 outline-none {link.href ==
									$page.url.pathname
										? 'shadow-glow-blue text-white bg-blue-box'
										: 'text-grey-2 hover:text-white hover:bg-white/3'}"
									on:click|preventDefault={() => {
										gotoUrl(link);
									}}
									disabled={link.href === ''}
								>
									<span
										class="absolute inset-y-0 left-0 inline-flex items-center w-12 justify-center"
									>
										<Icon data={link.svg} class="w-5 h-5" stroke="transparent"   />
									</span>
									<span>{link.title}</span>
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</nav>
	</div>
</aside>
