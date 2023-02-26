<script lang="ts">
	import { Icons } from '$lib/resources/IconResources';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { showErrorMessage } from '$lib/services/ToastService';
	import Tooltip from '$lib/components/layout/Tooltip.svelte';
	import type { ConnectorDataType } from '$lib/types/Types';
	import Modal from '$lib/components/layout/DeleteModel.svelte';
	import { openModal } from 'svelte-modals';
	import { DeleteQue } from '$lib/store';

	export let connector: ConnectorDataType;

	const handleOpenDeleteModal = (id: string) => {
		DeleteQue.set({ type: 'meta-connector', id });
		openModal(Modal, {});
	};
</script>

<svelte:head>
	<style>
		[data-tooltip]:before {
			content: attr(data-tooltip) !important;
		}
	</style>
</svelte:head>

<div
	class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 border border-blue flex items-center p-3 2xl:px-5 2xl:py-4 after:absolute after:inset-0 after:rounded-3xl after:ease-in-out after:duration-500 "
>
	<div class="space-y-2 flex-1 relative z-10">
		<!-- <div class="flex flex-wrap flex-row-reverse justify-between items-center gap-2"> -->
		<div class="flex flex-wrap flex-row-reverse justify-between items-start gap-2">
			<div class="flex flex-row-reverse flex-nowrap gap-1 items-center shrink-0">
				<button
					class="flex items-center justify-center shrink-0 p-0.5 text-red ease-in-out duration-300 hover:bg-red hover:text-white rounded-full w-5 h-5"
					on:click={() => {
						handleOpenDeleteModal(connector.id);
					}}
				>
					<Icon data={Icons.crossIcon} stroke="transparent" class="w-4 " />
				</button>
				{#if connector.active}
					<Tooltip
						tooltip="Successful"
						className="relative z-20 before:invisible before:opacity-0 before:pointer-events-none before:-translate-x-1/2 before:translate-y-8 before:ease-in-out before:duration-300 before:bottom-full before:left-1/2 before:mb-2 before:px-3 before:py-1 before:max-w-sm before:rounded-full before:bg-radial-green-3 before:text-white before:text-xs before:tracking-wider before:font-semibold before:absolute before:z-10 before:text-shadow-1 hover:before:visible hover:before:opacity-100 hover:before:translate-y-0 after:absolute after:invisible after:opacity-0 after:pointer-events-none after:-translate-x-1/2 after:translate-y-8 after:ease-in-out after:duration-300 after:bottom-full after:left-1/2 after:mb-1 after:bg-green-1 after:w-2 after:h-2 after:rotate-45 hover:after:visible hover:after:opacity-100 hover:after:translate-y-0 "
					>
						<span
							class="bg-radial-green-3 text-white w-5 h-5 inline-flex items-center justify-center rounded-full"
						>
							<Icon
								data={Icons.checkIcon}
								class="shrink-0 w-3 h-3"
								stroke="transparent"
								color="currentColor"
							/>
						</span></Tooltip
					>
				{:else}
					<Tooltip
						tooltip="Pending"
						className="relative z-20 before:invisible before:opacity-0 before:pointer-events-none before:-translate-x-1/2 before:translate-y-8 before:ease-in-out before:duration-300 before:bottom-full before:left-1/2 before:mb-2 before:px-3 before:py-1 before:max-w-sm before:rounded-full before:bg-grey before:text-white before:text-xs before:tracking-wider before:font-semibold before:absolute before:z-10 before:text-shadow-1 hover:before:visible hover:before:opacity-100 hover:before:translate-y-0 after:absolute after:invisible after:opacity-0 after:pointer-events-none after:-translate-x-1/2 after:translate-y-8 after:ease-in-out after:duration-300 after:bottom-full after:left-1/2 after:mb-1 after:bg-grey after:w-2 after:h-2 after:rotate-45 hover:after:visible hover:after:opacity-100 hover:after:translate-y-0 "
					>
						<span
							class="bg-grey text-white w-5 h-5 inline-flex items-center justify-center rounded-full"
						>
							<Icon
								data={Icons.loading}
								class="shrink-0 w-3 h-3 hover:animate-spin-slow"
								stroke="transparent"
								color="currentColor"
							/>
						</span></Tooltip
					>
				{/if}
			</div>
			<div class="flex gap-3 items-start flex-1">
				{#if connector.platform}
					<Icon
						data={Icons[connector.platform]}
						class="shrink-0 w-9 h-9"
						stroke="transparent"
						color="currentColor"
					/>
				{:else}
					<Icon
						data={Icons.worldWideWebIcon}
						class="shrink-0 w-9 h-9"
						stroke="transparent"
						color="currentColor"
					/>
				{/if}
				<div class="space-y-1.5">
					<h2 class="text-sm font-semibold leading-none">
						{connector.name ?? connector.domain}
					</h2>
					<p class="text-xs leading-none">{connector.id}</p>
				</div>
			</div>
		</div>
		<div class="flex justify-between gap-2 pl-12">
			<p class="flex-1 text-sm">
				<b class="font-medium">Last used:</b> N/A
			</p>
			<button
				class="outline-none"
				on:click={() => {
					showErrorMessage('This feature is not yet available');
				}}
			>
				<Icon
					data={Icons.files}
					class="w-5 ease-in-out duration-300 "
					stroke="transparent"
					color="currentColor"
				/>
			</button>
		</div>
	</div>
</div>
