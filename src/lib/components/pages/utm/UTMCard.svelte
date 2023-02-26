<script lang="ts">
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { showCopiedToClipboardToast } from '$lib/services/ToastService';
	import type { utmDataItem } from '$lib/types/Types';
	import { slide } from 'svelte/transition';

	export let source: utmDataItem;
</script>

<div
	class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 flex flex-col py-3 px-4 xs:py-5 xs:px-6 after:absolute after:inset-0 after:rounded-3xl after:ease-in-out after:duration-500 after:border-3 {source.isExpanded
		? 'after:border-blue'
		: 'after:border-transparent'} "
>
	<div class="relative flex flex-col gap-3 z-10 flex-1">
		<div class="flex justify-between gap-5">
			<div class="flex gap-2 xl:gap-4 items-center">
				<span class="shirink-0"
					><Icon data={source.logo} class="w-7 xl:w-10" stroke="transparent" /></span
				>
				<h2 class="capitalize text-xl xl:text-2xl font-bold">{source.name}</h2>
			</div>
			<div class="flex gap-2 items-center">
				<p class="text-md text-grey text-right leading-none">Click to copy</p>
				<button
					type="button"
					class="w-10 h-10 rounded-full flex justify-center items-center relative after:ease-in-out after:duration-300 hover:after:opacity-100 hover:before:after-100 after:opacity-0 after:rounded-full after:bg-radial-green-2 after:absolute after:inset-0"
					on:click={async () => {
						await navigator.clipboard.writeText(source.utmCode);
						showCopiedToClipboardToast();
					}}
				>
					<span class="relative z-10 leading-none">
						<Icon data={Icons.copySymbolIcon} class="w-5" stroke="transparent" />
					</span>
				</button>
			</div>
		</div>
		<div class="flex flex-col gap-3 flex-1 relative">
			<div class="flex-1 space-y-3 ">
				<p class="text-sm text-white break-words">
					{source.text}
				</p>

				{#if source.isExpanded}
					<div class="space-y-3 flex-col flex" transition:slide={{ duration: 300 }}>
						<p class="text-sm text-white">
							{source.fromText}
						</p>

						<div
							class="border-2 border-grey text-blue rounded-md p-3 font-semibold bg-color/20 break-words hover:bg-color/40 ease-in-out duration-300 hover:border-white/70"
							on:dblclick|preventDefault={async () => {
								await navigator.clipboard.writeText(source.utmCode);
								showCopiedToClipboardToast();
							}}
						>
							{#if source.displayUtm}
								{source.displayUtm}
							{:else}
								{source.utmCode}
							{/if}
						</div>
					</div>
				{/if}
			</div>
			<div class="flex justify-between gap-4">
				<p class="text-md text-grey leading-none" class:hidden={!source.isExpanded}>
					Double click to copy
				</p>

				<button
					on:click={() => {
						source.isExpanded = !source.isExpanded;
					}}
					class="relative ml-auto items-center justify-center rounded-full border-0 hover:shadow-glow-blue min-w-24 px-3 2xl:px-5 p-1.5 2xl:p-2.5 text-sm font-semibold :outline-none ease-in-out duration-300 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-100 before:inset-0 before:absolute hover:text-white text-white before:opacity-100 shadow-glow-blue inline-flex"
				>
					<span class="relative z-10 inline-flex items-center gap-1">
						<span class="whitespace-nowrap">Read {!source.isExpanded ? 'more' : 'less'} </span>
						<Icon
							data={Icons.triangleSymbolIcon}
							class="w-2.5 h-2.5 ease-in-out duration-300 {!source.isExpanded ? '' : 'rotate-180'}"
							stroke="transparent"
						/>
					</span>
				</button>
			</div>
		</div>
	</div>
</div>
