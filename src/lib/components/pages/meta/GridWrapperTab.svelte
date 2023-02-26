<script lang="ts">
	import { onMount } from 'svelte';
	import CampaignsDataGrid from './CampaignsDataGrid.svelte';
	import AdSetsDataGrid from './AdSetsDataGrid.svelte';
	import AdsDataGrid from './AdsDataGrid.svelte';
	import CheckBox from '$lib/components/layout/CheckBox.svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { GridDataTypes } from '$lib/helpers/ComponentsHelpers';
	import { fly } from 'svelte/transition';
	import { clickOutside } from '$lib/helpers/MiscHelpers';
	import { Icons } from '$lib/resources/IconResources';

	let showTableSettings = false;
	export let Source: any[];
	export let id: string;
	export let gridType: GridDataTypes;
</script>

<div class="absolute top-4 right-0 " {id}>
	<button
		id="table-settings-campaigns"
		class="{id} rounded-full border border-blue shadow-glow-blue inline-flex items-center gap-2 text-sm p-1.5 xs:px-4 {showTableSettings
			? 'bg-blue-box'
			: 'bg-glass'}"
		on:click={() => {
			showTableSettings = !showTableSettings;
		}}
		><span class="hidden xs:inline-flex">Table settings</span>
		<Icon
			data={Icons.settingsGearIcon}
			class="w-4 h-4  {showTableSettings ? 'text-white' : 'text-white'}"
			stroke="transparent"
		/>
	</button>
	{#if showTableSettings}
		<div
			in:fly={{ y: -50, duration: 500 }}
			out:fly={{ y: -50, duration: 300 }}
			class="absolute right-0 z-20 top-full overflow-hidden p-3 w-screen max-w-xs sm:max-w-xl  "
		>
			<div
				class="relative rounded-md bg-color focus:outline-none text-sm  before:absolute before:bg-dropdown before:backdrop-blur-2.5xl before:rounded-md before:shadow-dropdown before:opacity-80 before:inset-0 p-py- px-5"
			>
				<div class="p-5 relative z-10">
					Table settings are being developed. These will be available soon.
				</div>
			</div>
			<!-- <div
				class="relative rounded-md bg-color focus:outline-none text-sm before:absolute before:bg-dropdown before:backdrop-blur-2.5xl before:rounded-md before:shadow-dropdown before:opacity-60 before:inset-0"
			>
				<div class="p-5 relative z-10 sm:divide-x divide-y sm:divide-y-0 divide-grey sm:grid sm:grid-cols-2 on-hover-scroll max-h-96 overflow-auto"
					id="{id}-drop-wrapper"
					use:clickOutside={id}
					on:click_outside={() => {
						if (showTableSettings) {
							showTableSettings = false;
						}
					}}
				>
					<div class="pb-4 sm:pb-0 sm:pr-4 space-y-4">
						<h3 class="text-lg text-white leading-none font-medium flex gap-1">Goal min ROAS</h3>
						<div class="space-y-2">
							<div class="gap-4 flex items-center">
								<p class="font-semibold inline-flex min-w-20">Meta</p>
								<p
									class="bg-transparent w-16 rounded text-center border border-grey font-medium py-1 px-3 text-white"
								>
									1.63
								</p>
							</div>
							<div class="gap-4 flex items-center">
								<p class="font-semibold inline-flex min-w-20">Google</p>
								<p
									class="bg-transparent w-16 rounded text-center border border-grey font-medium py-1 px-3 text-white"
								>
									1.63
								</p>
							</div>
							<div class="gap-4 flex items-center">
								<p class="font-semibold inline-flex min-w-20">Tiktok</p>
								<p
									class="bg-transparent w-16 rounded text-center border border-grey font-medium py-1 px-3 text-white"
								>
									1.63
								</p>
							</div>
							<div class="gap-4 flex items-center">
								<p class="font-semibold inline-flex min-w-20">Snapchat</p>
								<p
									class="bg-transparent w-16 rounded text-center border border-grey font-medium py-1 px-3 text-white"
								>
									1.63
								</p>
							</div>
							<div class="gap-4 flex items-center">
								<p class="font-semibold inline-flex min-w-20">LinkedIn</p>
								<p
									class="bg-transparent w-16 rounded text-center border border-grey font-medium py-1 px-3 text-white"
								>
									1.63
								</p>
							</div>
							<div class="gap-4 flex items-center">
								<p class="font-semibold inline-flex min-w-20">Taboola</p>
								<p
									class="bg-transparent w-16 rounded text-center border border-grey font-medium py-1 px-3 text-white"
								>
									1.63
								</p>
							</div>
							<div class="gap-4 flex items-center">
								<p class="font-semibold inline-flex min-w-20">Outbrain</p>
								<p
									class="bg-transparent w-16 rounded text-center border border-grey font-medium py-1 px-3 text-white"
								>
									1.63
								</p>
							</div>
						</div>

						<div class="relative space-y-2">
							<select
								class="appearance-none border border-white/10 ease-in-out duration-500 bg-white/10 text-white py-2.5 px-3 focus:bg-color block w-60 font-medium text-left placeholder-white focus:outline-none rounded-md shadow-sm focus:border-blue focus:ring-blue text-sm outline-none leading-none peer invalid:border-red invalid:text-red"
							>
								<option>Columns: Performance</option>
							</select>
							<select
								class="appearance-none border border-white/10 ease-in-out duration-500 bg-white/10 text-white py-2.5 px-3 focus:bg-color block w-60 font-medium text-left placeholder-white focus:outline-none rounded-md shadow-sm focus:border-blue focus:ring-blue text-sm outline-none leading-none peer invalid:border-red invalid:text-red"
							>
								<option>Columns: Performance</option>
							</select>
							<select
								class="appearance-none border border-white/10 ease-in-out duration-500 bg-white/10 text-white py-2.5 px-3 focus:bg-color block w-60 font-medium text-left placeholder-white focus:outline-none rounded-md shadow-sm focus:border-blue focus:ring-blue text-sm outline-none leading-none peer invalid:border-red invalid:text-red"
							>
								<option>Columns: Performance</option>
							</select>
						</div>
					</div>
					<div class="pt-4 sm:pt-0 sm:pl-4">
						<table class="w-full">
							<tr>
								<th colspan="2" valign="top"
									><h3 class="text-lg text-white leading-none font-medium flex gap-1">
										Goal min ROAS
									</h3></th
								>
								<th class="font-normal text-sm pb-3 text-right">Sticky</th>
							</tr>
							<tr>
								<td class="py-2"
									><CheckBox
										labelClass="relative z-10 leading-none"
										label=""
										id="account-{account.ID}"
										classes="relative cursor-pointer"
										span="w-11 h-6 bg-white/10 flex border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full  after:-translate-x-px peer-checked:after:border-white after:absolute after:scale-110 after:top-[2px] after:left-[3px] after:bg-grey after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-blue-box peer-checked:after:border-transparent"
									/>
								</td>
								<td class="font-semibold px-3 py-2">Ad image</td>
								<td class="font-semibold py-2">
									<img src={checkGreen} alt="" class="w-4 ml-auto" />
								</td>
							</tr>
							<tr>
								<td class="py-2"
									><CheckBox
										labelClass="relative z-10 leading-none"
										label=""
										id="account-{account.ID}"
										classes="relative cursor-pointer"
										span="w-11 h-6 bg-white/10 flex border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full  after:-translate-x-px peer-checked:after:border-white after:absolute after:scale-110 after:top-[2px] after:left-[3px] after:bg-grey after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-blue-box peer-checked:after:border-transparent"
									/>
								</td>
								<td class="font-semibold px-3 py-2">Account name</td>
								<td class="font-semibold py-2">
									<img src={checkGreen} alt="" class="w-4 ml-auto" />
								</td>
							</tr>
							<tr>
								<td class="py-3"
									><CheckBox
										labelClass="relative z-10 leading-none"
										label=""
										id="account-{account.ID}"
										classes="relative cursor-pointer"
										span="w-11 h-6 bg-white/10 flex border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full  after:-translate-x-px peer-checked:after:border-white after:absolute after:scale-110 after:top-[2px] after:left-[3px] after:bg-grey after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-blue-box peer-checked:after:border-transparent"
									/>
								</td>
								<td class="font-semibold px-3 py-2">Ad name</td>
								<td class="font-semibold py-2 text-right">
									<img src={checkGreen} alt="" class="w-4 ml-auto" />
								</td>
							</tr>
							<tr>
								<td class="py-2"
									><CheckBox
										labelClass="relative z-10 leading-none"
										label=""
										id="account-{account.ID}"
										classes="relative cursor-pointer"
										span="w-11 h-6 bg-white/10 flex border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full  after:-translate-x-px peer-checked:after:border-white after:absolute after:scale-110 after:top-[2px] after:left-[3px] after:bg-grey after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-blue-box peer-checked:after:border-transparent"
									/>
								</td>
								<td class="font-semibold px-3 py-2">Meta ad spend</td>
								<td class="font-semibold py-2 text-right">
									<img src={checkGrey} alt="" class="w-4 ml-auto" />
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div> -->
		</div>
	{/if}
</div>

<div
	class="w-full flex-1 border-gradient border-gradient-blue bg-transparent relative before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:rounded-tl-none rounded-3xl rounded-tl-none before:shadow-glass-dropdown before:opacity-30 before:inset-0 max-w-full"
>
<div class="rounded-3xl overflow-hidden w-full">
	<div
		class="overflow-auto w-full flex-1 scrollbar scroll-card-meta md:min-h-full relative z-10"
	>
		{#if gridType === GridDataTypes.campaigns}
			<CampaignsDataGrid CampaignsSource={Source} />
		{/if}
		{#if gridType === GridDataTypes.adsets}
			<AdSetsDataGrid AdSetsSource={Source} />
		{/if}
		{#if gridType === GridDataTypes.ads}
			<AdsDataGrid AdsSource={Source} />
		{/if}
	</div>
	 </div>
</div>
