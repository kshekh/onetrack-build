<script>
	import { clickOutside } from '$lib/helpers/MiscHelpers';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { slide } from 'svelte/transition';

	export let modelData;
	let readMore = false;
	let id = 'reademore-dropdown';
</script>

<div
	class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass before:opacity-30 before:inset-0 hover:before:opacity-70 flex items-center py-3 px-4 xl:py-5 xl:px-6 "
>
	<div
		class="relative flex flex-col xs:flex-row gap-x-4 gap-y-5 z-10 justify-between flex-1 {readMore
			? 'items-stretch'
			: 'items-start'}"
	>
		<div class="flex gap-2 xl:gap-4 items-start 2xl:pt-1.5 flex-1 ">
			<!-- #if (platform logo) -->
			<img src={Icons.metaLogoIcon} alt="facebook" class="w-12" />
			<!-- else -->
			<div
				class="h-12 w-12 rounded-full flex justify-center items-center bg-white/10 shrink-0 hidden"
			>
				<Icon data={modelData.icon} class="w-5 h-5 text-white" stroke="transparent" />
			</div>
			<!-- End if -->
			<div class="relative flex-1">
				<div class="space-y-2">
					<div class="space-y-1">
						<h3 class="2xl:text-lg text-white leading-none font-medium ">{modelData.title}</h3>
						<p class="text-xs leading-none break-all">{modelData.subheading ?? ''}</p>
					</div>
					{#if modelData.date}
						<p class="text-xs leading-none line-clamp-2 break-all">{modelData.date}</p>
					{:else}
						<p class="text-xs leading-none line-clamp-2 break-all">{modelData.detail}</p>
					{/if}
				</div>
				{#if readMore}
					<div
						class="relative pt-5 "
						id="{id}-drop-wrapper"
						use:clickOutside={id}
						transition:slide
						on:click_outside={() => {
							readMore = !readMore;
						}}
					>
						<table class="w-full">
							<tr>
								<th class="text-white leading-none font-medium py-1 text-left">Info</th>
								<td class="text-sm leading-none py-1 pl-4"
									>Lorem ipsum dolor sit amet, consetetur</td
								>
							</tr>
							<tr>
								<th class="text-white leading-none font-medium py-1 text-left ">Info</th>
								<td class="text-sm leading-none py-1 pl-4"
									>Lorem ipsum dolor sit amet, consetetur</td
								>
							</tr>
							<tr>
								<th class="text-white leading-none font-medium py-1 text-left ">Info</th>
								<td class="text-sm leading-none py-1 pl-4"
									>Lorem ipsum dolor sit amet, consetetur</td
								>
							</tr>
							<tr>
								<th class="text-white leading-none font-medium py-1 text-left ">Info</th>
								<td class="text-sm leading-none py-1 pl-4"
									>Lorem ipsum dolor sit amet, consetetur</td
								>
							</tr>
							<tr>
								<th class="text-white leading-none font-medium py-1 text-left ">Info</th>
								<td class="text-sm leading-none py-1 pl-4"
									>Lorem ipsum dolor sit amet, consetetur</td
								>
							</tr>
							<tr>
								<th class="text-white leading-none font-medium py-1 text-left ">Info</th>
								<td class="text-sm leading-none py-1 pl-4"
									>Lorem ipsum dolor sit amet, consetetur</td
								>
							</tr>
						</table>
					</div>
				{/if}
			</div>
		</div>
		<div class="space-y-1.5 flex flex-col justify-between shrink-0 ">
			<p class="text-xs leading-none text-right">{modelData.date ?? ''}</p>
			<button
				on:click={() => {
					readMore = !readMore;
				}}
				class="relative inline-flex items-center justify-center rounded-full border-0 hover:shadow-glow-blue w-32 px-3 2xl:px-5 p-1.5 2xl:p-2.5 text-sm font-semibold :outline-none ease-in-out duration-300 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-100 before:inset-0 before:absolute hover:text-white text-white before:opacity-100 shadow-glow-blue"
				{id}
			>
				<span class="relative z-10 inline-flex items-center gap-1"
					><span class="whitespace-nowrap">Read {readMore ? 'less' : 'more'}</span><Icon
						data={Icons.triangleSymbolIcon}
						class="w-2.5 h-2.5 ease-in-out duration-300 {readMore ? 'rotate-180' : ''}"
						stroke="transparent"
						color="currentColor"
					/></span
				>
			</button>
		</div>
	</div>
</div>
