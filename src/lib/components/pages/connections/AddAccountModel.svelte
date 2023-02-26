<script lang="ts">
	import { goto } from '$app/navigation';
	import { closeModal } from 'svelte-modals';
	import { fly } from 'svelte/transition';
	export let isOpen = false;

	let action = 'add-source';

	function handleSave() {
		closeModal();
		if (action == 'add-source') {
			goto('/tracking/connections/add/source');
		} else {
			goto('/tracking/connections/add/destination');
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex p-3 items-center justify-center "
		in:fly={{ y: -50, duration: 500 }}
		out:fly={{ y: -50, duration: 300 }}
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="fixed inset-0 bg-black/90 transition-opacity cursor-default"
			on:click={closeModal}
		/>

		<div
			class="relative transform max-h-full flex flex-col rounded-3xl bg-color p-3 text-left shadow-xl transition-all sm:my-5 w-full max-w-md "
		>
			<div
				class="relative overflow-auto max-w-full flex-1 max-h-full on-hover-scroll transform rounded-3xl py-3 xs:p-5 sm:py-10 space-y-7"
					>
				<div class="space-y-1 px-3">
					<h2 class="text-lg md:text-2xl text-white leading-none font-bold text-center">
						What do you want to do?
					</h2>
				</div>
				<div class="relative space-y-6 px-5 flex-1 min-h-60">
					<label
						for="add-source"
						class="text-white relative group cursor-default flex items-center px-4 gap-4 "
									>
						<input
							type="radio"
							id="add-source"
							name="add-option"
							class="peer sr-only"
							value="add-source"
							bind:group={action}
						/>
						<span
							class="border-2 border-white w-6 h-6 rounded-full inline-flex items-center justify-center relative after:absolute after:top-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:rounded-full after:bg-blue-box after:opacity-0 peer-checked:after:opacity-100 after:transitions gruop-hover:after:opacity-100"
							><span class="sr-only">Add Source</span></span
						>
						<span class="">Add source</span>
					</label>
					<label
						for="add-destination"
						class="text-white relative group cursor-default flex items-center px-4 gap-4 opacity-50"
					>
						<input
							type="radio"
							id="add-destination"
							name="add-option"
							class="peer sr-only"
							value="add-destination"
							disabled
							bind:group={action}
						/>
						<span
							class="border-2 border-white w-6 h-6 rounded-full inline-flex items-center justify-center relative after:absolute after:top-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:rounded-full after:bg-blue-box after:opacity-0 peer-checked:after:opacity-100 after:transitions gruop-hover:after:opacity-100"
							><span class="sr-only">Add destination</span></span
						>
						<span class="">Add destination (coming soon)</span>
					</label>
				</div>

				<div class="flex gap-4 justify-center">
					<button
						type="button"
						on:click={closeModal}
						class="relative inline-flex items-center justify-center rounded-full bg-transparent min-w-24 px-6 p-3 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-red ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-red after:absolute hover:shadow-glow-red before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute"
						><span class="relative z-10 leading-none">Cancel</span></button
					>

					<button
						on:click={handleSave}
						type="button"
						class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue hover:shadow-glow-green text-white min-w-24 px-6 p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green ring-offset-color ease-in-out duration-300 focus:ring-offset-2 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 after:ease-in-out after:duration-300 hover:after:opacity-100 hover:before:opacity-0 after:opacity-0 after:rounded-full after:bg-radial-green-2 before:inset-0 after:inset-0 before:absolute after:absolute"
						><span class="relative z-10 leading-none">Proceed</span></button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
