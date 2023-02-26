<script>
	import CheckBox from '$lib/components/layout/CheckBox.svelte';
	import { showLoader, hideLoader } from '$lib/helpers/MiscHelpers';
	import {
		GetAllCustomerEvents,
		GetAllCustomerEventsByVisitorId
	} from '$lib/services/CustomerEventsHttpService';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { Workspace, CustomerEvents, CurrentRange } from '$lib/store';
	import { getTimeZoneAdjustedTimestampSeconds } from '$lib/helpers/UserHelpers';
	import { showMessage } from '$lib/services/ToastService';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import _ from 'underscore';
	import moment from 'moment';
	import { goto } from '$app/navigation';

	let workspaceId = null;
	let uniqueCustomers = [];
	let searchQuery = '';
	let customers = [];
	let showBanner = true;

	onMount(async () => {
		showLoader('Crafting customer insights...');
		Workspace.subscribe(async (ws) => {
			try {
				if (!ws) {
					return;
				}

				workspaceId = ws._id;
				//await loadData();
			} catch (err) {
				console.error(err);
			} finally {
				hideLoader();
			}
		});
	});
	async function loadData() {
		let range = get(CurrentRange);
		customers = await GetAllCustomerEvents(
			workspaceId,
			getTimeZoneAdjustedTimestampSeconds(range.start.unix()) * 1000,
			getTimeZoneAdjustedTimestampSeconds(range.end.unix()) * 1000,
			0,
			500
		);
		convertUniqueCustomerIdsToObjects(_.uniq(customers.events.map((x) => x.visitorId)));
	}
	function convertUniqueCustomerIdsToObjects(uniqueIds) {
		uniqueCustomers = uniqueIds.map((x) => {
			return {
				userId: x,
				userName: 'N/A',
				email: 'N/A',
				check: false
			};
		});
		CustomerEvents.set(customers);
	}

	function handleCheckAllCheckbox(checked) {
		uniqueCustomers = [...uniqueCustomers].map((user) => ({ ...user, check: checked }));
	}

	async function searchHandler() {
		if (!searchQuery) {
			showMessage('Loading...', `Loading customer events`, 'info');
			//await loadData();
		} else {
			showMessage('Searching...', `Searching events against user "${searchQuery}"`, 'info');
			customers = await GetAllCustomerEventsByVisitorId(
				workspaceId,
				getTimeZoneAdjustedTimestampSeconds(moment().subtract(29, 'days').unix()) * 1000,
				getTimeZoneAdjustedTimestampSeconds(moment().unix()) * 1000,
				0,
				1000,
				searchQuery.trim()
			);
			convertUniqueCustomerIdsToObjects(_.uniq(customers.events.map((x) => x.visitorId)));
		}
		if (searchQuery) {
			showMessage('Search was successful', `we found ${customers.events.length} events`, 'success');
		}
	}
</script>

{#if showBanner} -->
	  <div class="grid h-full items-center">
		<div class="max-w-screen-md mx-auto h-fit rounded-xl p-8 bg-slate-800 align-middle">
			<h1 class="text-3xl">Page is under up-gradation process 🚀</h1>
			<p class="text-lg">
				We are working tirelessly to improve the analytical engine which processes customer insights
				for you. This page with improved customer insights will be available soon.
			</p>
		</div>
	</div>
{:else}
	<main class="p-0 max-w-screen-xl mx-auto w-full flex flex-col">
		<div class="flex flex-wrap justify-between items-center gap-3 border-b border-grey pb-5 ">
			<h2 class="text-lg md:text-xl text-white leading-none font-medium flex gap-1">
				Customer Overview
			</h2>
			<div class="flex gap-4">
				<button
					type="button"
					on:click={() => {
						showMessage(
							'Export functionality is being developed right now. It will be available soon.',
							'',
							'info'
						);
					}}
					class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue hover:shadow-glow-green text-white min-w-28 p-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green ring-offset-color ease-in-out duration-300 focus:ring-offset-2 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 after:ease-in-out after:duration-300 hover:after:opacity-100 hover:before:opacity-0 after:opacity-0 after:rounded-full after:bg-radial-green-2 before:inset-0 after:inset-0 before:absolute after:absolute "
					><span class="relative z-10 leading-none">Export</span></button
				>
				<button
					type="button"
					on:click={() => {
						showMessage(
							'Import functionality is being developed right now. It will be available soon.',
							'',
							'info'
						);
					}}
					class="relative inline-flex items-center justify-center rounded-full bg-transparent min-w-28 p-4 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-blue ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-blue-box after:absolute hover:shadow-glow-blue before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute"
					><span class="relative z-10 leading-none"
						><span class="relative z-10 leading-none">Import</span></span
					></button
				>
			</div>
		</div>

		<div class="flex flex-wrap justify-between gap-4 items-center py-5">
			<div class="relative">
				<CheckBox
					onChange={(checked) => handleCheckAllCheckbox(checked)}
					labelClass="relative z-10 leading-none"
					label="Select all"
					id="select-all"
					classes="relative cursor-pointer"
					span="relative cursor-pointer inline-flex items-center justify-center rounded-full bg-transparent min-w-28 p-4 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-blue ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-blue-box after:absolute hover:shadow-glow-blue before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute peer-checked:after:opacity-100 peer-checked:before:opacity-0 peer-checked:shadow-glow-blue"
				/>
			</div>
			<div class="relative w-full sm:w-auto">
				<form class="flex items-stretch gap-3 ">
					<div class="relative w-full sm:max-w-md flex items-center">
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
								class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block max-w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm p-3 xs:pl-10 outline-none leading-none peer invalid:border-red invalid:text-red h-11 xs:w-80"
								bind:value={searchQuery}
								type="search"
								id="search"
								placeholder="Search"
								name="search"
							/>
						</div>
					</div>

					<div class="w-full sm:max-w-sm hidden items-stretch">
						<input
							type="search"
							bind:value={searchQuery}
							name="search"
							id="search"
							class="border border-grey flex-1 ease-in-out duration-500 bg-transparent block w-full text-left placeholder-white focus:outline-none rounded-md shadow-sm focus:border-blue focus:ring-blue text-sm outline-none leading-none peer invalid:border-red invalid:text-red"
							placeholder="Search"
						/>
					</div>
					<button
						type="submit"
						class="relative inline-flex items-center justify-center rounded-full border-0 shadow-glow-blue hover:shadow-glow-green text-white  px-7 p-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green ring-offset-color ease-in-out duration-300 focus:ring-offset-2 before:bg-blue-box before:rounded-full before:ease-in-out before:duration-300 after:ease-in-out after:duration-300 hover:after:opacity-100 hover:before:opacity-0 after:opacity-0 after:rounded-full after:bg-radial-green-2 before:inset-0 after:inset-0 before:absolute after:absolute "
						on:click|preventDefault={searchHandler}
						><Icon
							data={Icons.searchIcon}
							stroke="transparent"
							class="w-4 h-4 xs:hidden text-white relative z-10"
						/><span class="hidden xs:inline-flex relative z-10 leading-none">Search</span></button
					>
				</form>
			</div>
		</div>

		<div class="flex flex-col">
			<div class="flex flex-col md:grid md:grid-cols-2 gap-5">
				{#each uniqueCustomers as user}
					<div
						class=" relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 border-3 border-blue flex items-center py-3 px-4 xs:py-5 xs:px-6 after:absolute after:inset-0 after:rounded-3xl hover:after:shadow-glow-blue after:ease-in-out after:duration-500 hover:before:opacity-80"
						on:dblclick={() => {
							goto(`/analysis/customer-details/${user.userId}`);
						}}
						>
						<div
							class="relative z-10 flex justify-between flex-wrap items-center gap-1.5 xs:gap-3 lg:gap-x-5 2xl:gap-x-10 flex-1  truncate"
							checked={user.check}
							>
							<div class="flex gap-2 xs:gap-5 items-center">
								<CheckBox
									checked={user.check}
									id="userid-{user.userId}"
									span="w-5 h-5 relative border border-grey rounded-sm block flex justify-center items-center after:-mt-0.5 after:border-l-2 after:border-b-2 after:border-white after:w-2.5 after:h-1.5 after:-rotate-45 after:block after:opacity-0 peer-checked:after:opacity-100 peer-checked:bg-blue-box peer-checked:border-blue"
									labelClass="sr-only"
									classes="relative cursor-pointer "
								/>
								<div class="flex items-center gap-2 xs:gap-x-5 shrink-0">
									<div class="h-12 w-12 rounded-full flex justify-center items-center bg-white/10">
										<!-- <Icon data={Icons.singleManCustomerIcon} class="w-5 h-5 text-white" /> -->
										<img
											src={Icons.svgUrls.avatarUrl}
											class="object-cover aspect-square w-full"
											alt="Avatar"
										/>
									</div>

									<div class="space-y-1 flex flex-col">
										<h3 class="block text-sm font-semibold text-white">
											<a
												class="text-white ease-in-out duration-300 hover:text-blue-400"
												href="/analysis/customer-details/{user.userId}">{user.userName}</a
											>
										</h3>
										<p class="text-sm leading-none ">
											<a
												class="text-white block  break-words ease-in-out duration-300 hover:text-blue-400"
												href="/analysis/customer-details/{user.userId}">{user.userId}</a
											>
										</p>
									</div>
								</div>
							</div>
							<div class="max-w-full">
								<p class="text-sm leading-none truncate">{user.email}</p>
							</div>
							<div class="ml-auto">
								<button
									class="w-9 h-9 rounded-full flex justify-center items-center relative after:ease-in-out after:duration-300 hover:after:opacity-100 hover:before:after-100 after:opacity-0 after:rounded-full after:bg-radial-green-2 after:absolute after:inset-0 ease-in-out duration-300 "
									><span class="relative z-10 leading-none"
										><Icon data={Icons.pencilIcon} stroke="transparent" class="w-4 h-4" /></span
									></button
								>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			<nav class="flex items-center justify-end pt-10">
				<div class="flex items-center justify-end gap-2">
					<div class="flex gap-2 items-center">
						<span class="inline-flex items-center text-sm font-medium text-white"
							>Items per page:</span
						>
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
		</div>
	</main>
{/if}
