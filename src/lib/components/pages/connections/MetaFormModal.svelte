<script>
	import { closeModal } from 'svelte-modals';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { goto } from '$app/navigation';
	import { uniqueId } from 'underscore';
	export let isOpen;

	let pixelsIds = [];
	let conversionAPIs = [];
	let accountName = '';
	let showError = false;
	let errorMessage = '';
	let errorHeading = '';
	let userName = null;

	onMount(async () => {
		pixelsIds = [];
		conversionAPIs = [];
		addEmptyItemInPixelIDs();
		addEmptyItemInConverAPIs();
	});
	function addEmptyItemInPixelIDs() {
		pixelsIds.push({ name: '', value: '', id: uniqueId() });
		pixelsIds = pixelsIds;
	}
	function addEmptyItemInConverAPIs() {
		conversionAPIs.push({ name: '', value: '', id: uniqueId() });
		conversionAPIs = conversionAPIs;
	}
	function removeItemFromPixelIds(id) {
		pixelsIds = pixelsIds.filter((x) => x.id != id);
	}
	function removeItemFromConversionApis(id) {
		conversionAPIs = conversionAPIs.filter((x) => x.id != id);
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
<div class="fixed inset-0 bg-black/90 transition-opacity cursor-default"
	on:click={closeModal} />

<div class="relative z-10 transform max-h-full flex flex-col rounded-3xl bg-color text-left shadow-xl transition-all py-3 sm:my-5 w-full max-w-3xl ">
	<div class="relative overflow-auto max-w-full flex-1 max-h-full on-hover-scroll transform rounded-3xl py-3 xs:py-5 sm:py-8 space-y-7">
		
			{#if !showError}

			<div class="space-y-1 flex gap-3 px-3 sm:px-5 lg:px-10">
				<span class="shrink-0"><Icon data={Icons.metaLogoIcon} stroke="transparent" class="w-10" /></span>
				<h2 class="text-lg md:text-2xl text-white leading-none font-bold text-center">
					Meta
				</h2>					 
			</div>
			<div class="divide-y divide-grey space-y-10">
				<div class="xs:grid xs:grid-cols-2 gap-5 pt-10 first-of-type:pt-0 px-3 sm:px-5 lg:px-10">
					<div class="relative w-full flex items-center">
						<label for="account_name" class="sr-only">Name</label>
						<div class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl w-full">
							<input class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 px-5 outline-none leading-none peer invalid:border-red invalid:text-red h-11 w-full" type="text"	id="account_name" placeholder="Account Name" name="account_name" bind:value={accountName} />
						</div>
					</div>				 
				</div>
				<div class="pt-8 first-of-type:pt-0 space-y-3 px-3 sm:px-5 lg:px-10">
					<div class="flex justify-between items-center gap-3 w-full">
						<h4 class="text-lg font-semibold">Pixel ID</h4> <button on:click={addEmptyItemInPixelIDs} class="relative before:rounded-md before:shadow-glass before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl shrink-0 w-10 h-10 hidden"><span class="relative z-10">+</span></button> 
					</div>
					{#each pixelsIds as item (item.id)}
					<div class="flex flex-col xs:flex-row flex-wrap gap-3 ">
						<div class="relative flex-1 flex items-center">
							<label for="item_name" class="sr-only">Pixel Name</label>
							<div class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl w-full">
								<input class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 px-5 outline-none leading-none peer invalid:border-red invalid:text-red h-11 w-full" type="text"	id="item_name" placeholder="Account Name" name="item_name" bind:value={item.name} />
							</div>
						</div>	
						<div class="relative flex-1 flex items-center">
							<label for="item_value" class="sr-only">Pixel Value</label>
							<div class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl w-full">
								<input class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 px-5 outline-none leading-none peer invalid:border-red invalid:text-red h-11 w-full" type="text"	id="item_value" placeholder="Account Value" name="item_value" bind:value={item.value} />
							</div>
						</div>	
						<button on:click={() => {removeItemFromPixelIds(item.id);}} class="relative before:rounded-md before:shadow-glass before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl shrink-0 w-10 hidden"><span class="relative z-10">-</span></button>								
					</div>
				 	{/each}
				</div>


				<div class="pt-8 first-of-type:pt-0 space-y-3 px-3 sm:px-5 lg:px-10">
					<div class="flex justify-between items-center gap-3 w-full">
						<h4 class="text-lg font-semibold">Conversion API</h4> <button on:click={addEmptyItemInConverAPIs} class="relative before:rounded-md before:shadow-glass before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl shrink-0 w-10 h-10 hidden"><span class="relative z-10">+</span></button> 
					</div>
					{#each conversionAPIs as item (item.id)}
					<div class="flex flex-col xs:flex-row flex-wrap gap-3 ">
						<div class="relative flex-1 flex items-center">
							<label for="ConverAPIs_name" class="sr-only">Conversion API Name</label>
							<div class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl w-full">
								<input class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 px-5 outline-none leading-none peer invalid:border-red invalid:text-red h-11 w-full" type="text"	id="ConverAPIs_name" placeholder="Conversion API Name" name="ConverAPIs_name" />
							</div>
						</div>	
						<div class="relative flex-1 flex items-center">
							<label for="ConverAPIs_value" class="sr-only">Conversion API</label>
							<div class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl w-full">
								<input class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 px-5 outline-none leading-none peer invalid:border-red invalid:text-red h-11 w-full" type="text"	id="ConverAPIs_value" placeholder="Conversion API Value" name="ConverAPIs_value" />
							</div>
						</div>	
						<button on:click={() => {removeItemFromConversionApis(item.id);}} class="relative before:rounded-md before:shadow-glass before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl shrink-0 w-10 hidden"><span class="relative z-10">-</span></button>								
					</div>
				 	{/each}
				</div>


			</div> 

  			<div class="flex gap-4 justify-end p-3 pb-0 sm:p-5 sm:pb-0 lg:px-10">
					<button
						type="button"
						on:click={closeModal}
						class="relative inline-flex items-center justify-center rounded-full bg-transparent min-w-24 px-6 p-3 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-red ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-red after:absolute hover:shadow-glow-red before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute"
						><span class="relative z-10 leading-none">Clear</span></button
					>

					<button
					on:click={closeModal}
						type="button"
						class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue hover:shadow-glow-green text-white min-w-24 px-6 p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green ring-offset-color ease-in-out duration-300 focus:ring-offset-2 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 after:ease-in-out after:duration-300 hover:after:opacity-100 hover:before:opacity-0 after:opacity-0 after:rounded-full after:bg-radial-green-2 before:inset-0 after:inset-0 before:absolute after:absolute"
						><span class="relative z-10 leading-none">Save</span></button
					>
			</div>
 
		
		
		
				{:else}
				<div class="vf">
					<h2 style="align-self:center;">{errorHeading}</h2>
					<p style="text-align: center;">{errorMessage}</p>

					<button
					type="button"
					on:click={closeModal}
					class="relative inline-flex items-center justify-center rounded-full bg-transparent min-w-24 px-6 p-3 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-red ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-radial-red after:absolute hover:shadow-glow-red before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute"
					><span class="relative z-10 leading-none">Cancel</span></button
				>

 
				</div>
			{/if}
		</div>
	</div>	
</div>
{/if}
 