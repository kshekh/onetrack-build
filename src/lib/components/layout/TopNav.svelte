<script>
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { goto } from '$app/navigation';
	import { User } from '$lib/store';
	import { signOut } from '$lib/services/AuthService';
	import { openModal } from 'svelte-modals';
	import Modal from '$lib/components/layout/SideNavModal.svelte';
	import { onMount } from 'svelte';
	import WorkspaceSelection from '$lib/components/userManagement/WorkspaceSelection.svelte';
	import ProjectSelection from '$lib/components//userManagement/ProjectSelection.svelte';
	import TagsSelection from '$lib/components//userManagement/TagsSelection.svelte';
	import { slide } from 'svelte/transition';
	import { showMessage } from '$lib/services/ToastService';
	import { Icons } from '$lib/resources/IconResources';

	let showProfileDropdown = false;
	let showNotificationDropdown = false;
	let mobileDropdown = false;

	onMount(() => {
		document.addEventListener('click', (event) => {
			let elm = document.getElementById('profile-btn');
			let elm2 = document.getElementById('notification-btn');
			if (!elm) {
				return;
			}
			if (!elm2) {
				return;
			}
			const isClickInside = elm.contains(event.target);
			const isClickInside2 = elm2.contains(event.target);

			if (!isClickInside) {
				showProfileDropdown = false;
			}
			if (!isClickInside2) {
				showNotificationDropdown = false;
			}
		});
	});
	function handleOpen() {
		openModal(Modal, {});
	}
	function pageUnderDevelopment(pageName) {
		showMessage(
			`"${pageName[0].toUpperCase()}${pageName.slice(
				1,
				pageName.length
			)}" page is being developed. It will be available soon.`,
			'',
			'info'
		);
	}
	function gotoStatusPage() {
		window.open('https://www.one-track.io/status', '_blank');
	}
</script>

<!-- not responsive yet -->
<nav class="z-40 fixed inset-x-0 top-0 lg:pl-64">
	<div class="flex justify-between border-b border-grey bg-color">
		<div class="flex lg:hidden">
			<button
				class="border-r border-grey py-2 flex justify-center items-center w-12"
				on:click={handleOpen}
			>
				<Icon data={Icons.sideMenuIcon} stroke="transparent" class="w-6 h-6" color="currentColor" />
			</button>
		</div>

		<div class="flex gap-2 md:gap-3 xl:gap-5 flex-1 justify-end px-3 md:pr-5 xl:pr-7">
			<div class="relative flex items-center order-2 md:order-1 ">
				<button
					class="rounded-full w-9 h-9 flex justify-center items-center text-white md:hidden {mobileDropdown
						? 'ring-4 ring-blue bg-blue ring-offset-2 ring-offset-color'
						: 'ring-0 ring-transparent bg-white/5'}"
					on:click={() => {
						mobileDropdown = !mobileDropdown;
					}}
				>
					<Icon
						data={Icons.triangleSymbolIcon}
						class="w-3 h-3 transitions {mobileDropdown ? 'rotate-180' : ''}"
						color="currentColor"
					/>
				</button>

				<div
					class="flex-col md:grid md:grid-cols-3 gap-3 absolute top-full right-0 bg-color border border-grey rounded rounded-t-none p-2 md:p-0 md:static md:bg-transparent md:border-transparent md:rounded-none md:w-auto md:border-0 {mobileDropdown
						? 'flex'
						: 'hidden'}"
					transition:slide
				>
					<WorkspaceSelection />
					<ProjectSelection />
					<TagsSelection />
				</div>
			</div>
			<div class="flex justify-between gap-1.5 md:w-44 items-center py-2.5 order-1">
				<button
					type="button"
					class="px-2 py-1 transitions inline-flex items-center outline-none shrink-0"
				>
					<span class="overflow-hidden w-8 h-6 inline-flex justify-center items-center">
						<Icon
							data={Icons.germanFlagIcon}
							class="rounded-md min-w-full min-h-full h-auto w-auto"
							color="transparent"
						/>
					</span>
				</button>
				<button
					type="button"
					class="p-2 shrink-0 rounded-full hover:bg-white/10 flex justify-center outline-none items-center transitions text-blue hover:text-white focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-color outline-none"
				>
					<Icon
						data={Icons.fullScreenIcon}
						class="w-4 h-4"
						color="currentColor"
						stroke="transparent"
					/>
				</button>

				<div class="relative shrink-0 flex items-center ">
					<button
						id="notification-btn"
						type="button"
						class="p-2 rounded-full hover:bg-white/10 flex justify-center items-center transitions text-blue hover:text-white outline-none {showNotificationDropdown
							? 'ring-2 ring-blue  ring-offset-2 ring-offset-color text-white outline-none'
							: 'ring-0 ring-transparent  text-blue'}"
						on:click={() => {
							showNotificationDropdown = !showNotificationDropdown;
						}}
					>
						<Icon
							data={Icons.notificationIcon}
							class="w-4 h-4"
							color="currentColor"
							stroke="transparent"
						/>
					</button>
					{#if showNotificationDropdown}
						<div
							transition:slide
							class="absolute w-48 mt-4 top-full right-0 z-10 bg-color focus:outline-none text-sm before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass before:ease-in-out before:duration-300 before:absolute before:inset-0 before:h-full before:w-full before:rounded-md rounded-md shadow-dropdown"
							tabindex="-1"
							role="listbox"
							aria-labelledby="listbox-label"
							aria-activedescendant="listbox-option-3"
						>
							<div class="max-h-64 on-hover-scroll overflow-auto rounded-md relative z-10">
								<div class="text-white space-y-1  px-3 py-2">
									<p class="text-sm leading-none" role="none">
										Notifications - will be available soon.
									</p>
								</div>

								<!-- <div class="py-1 space-y-2" role="none">
										<div class="flex gap-x-3 pl-7 relative">
											<span class="absolute left-0 top-0 flex items-center justify-center text-blue"
												><Icon data={profileIcon} class="w-4 h-4" color="currentColor" /></span
											>
											<span class="flex flex-col gap-0.5 text-xs">
												<b class="font-medium">Alert</b>
												<span class=" text-grey-2 leading-normal"
													>Some poor things are happening</span
												>
											</span>
										</div>
									</div> -->
							</div>
						</div>
					{/if}
				</div>

				<div class="relative shrink-0 flex items-center ml-1 ">
					<button
						type="button"
						id="profile-btn"
						class="w-9 h-9 rounded-full hover:bg-white/10 flex justify-center items-center transitions overflow-hidden outline-none {showProfileDropdown
							? 'ring-2 ring-blue bg-blue ring-offset-2 ring-offset-color text-white '
							: 'ring-0 ring-transparent bg-white/5 text-blue'}"
						on:click={() => {
							showProfileDropdown = !showProfileDropdown;
						}}
					>
						<img
							src="/images/profile-photo.png"
							class="object-cover aspect-square hidden"
							alt="face user"
						/>
						<img src={Icons.svgUrls.avatarUrl} class="object-cover aspect-square" alt="Avatar" />
					</button>
					{#if showProfileDropdown}
						<div
							transition:slide
							class="absolute w-48 mt-4 top-full right-0 z-10 bg-color focus:outline-none text-sm before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl before:shadow-glass before:ease-in-out before:duration-300 before:absolute before:inset-0 before:h-full before:w-full before:rounded-md rounded-md shadow-dropdown"
							tabindex="-1"
							role="listbox"
							aria-labelledby="listbox-label"
							aria-activedescendant="listbox-option-3"
						>
							<div class="max-h-64 on-hover-scroll overflow-auto rounded-md relative z-10">
								<div class="px-4 pt-3 space-y-3" role="none">
									<div class="text-white space-y-1">
										<p class="text-sm leading-none" role="none">Signed in as</p>
										<p class="truncate text-sm font-normal leading-none" role="none">
											{$User.email}
										</p>
									</div>
									<hr class="border-b w-full border-0 border-grey/30" />
								</div>

								<div class="py-1 spacce-y-1" role="none">
									<button
										type="button"
										role="menuitem"
										tabindex="-1"
										class="text-white/60 hover:text-white group outline-none w-full flex items-center pl-12 hover:bg-grey/20 transitions py-1.5 text-sm relative border-y border-transparent hover:border-grey/20"
										on:click={() => {
											goto('/settings/profile');
											showProfileDropdown = false;
										}}
									>
										<span
											class="inset-y-0 absolute left-6 flex items-center justify-center text-blue"
											><Icon
												data={Icons.singleCustomerIcon}
												stroke="transparent"
												class="w-4 h-4"
												color="currentColor"
											/></span
										>
										<span>Profile</span>
									</button>
									<button
										type="button"
										role="menuitem"
										tabindex="-1"
										class="text-white/60 hover:text-white group outline-none w-full flex items-center pl-12 hover:bg-grey/20 transitions py-1.5 text-sm relative border-y border-transparent hover:border-grey/20"
										on:click={() => {
											pageUnderDevelopment('settings');
											showProfileDropdown = false;
										}}
									>
										<span
											class="inset-y-0 absolute left-6 flex items-center justify-center text-blue"
											><Icon
												data={Icons.settingsGearIcon}
												stroke="transparent"
												class="w-4 h-4"
												color="currentColor"
											/></span
										>
										<span>Settings</span>
									</button>
									<button
										type="button"
										role="menuitem"
										tabindex="-1"
										class="text-white/60 hover:text-white group outline-none w-full flex items-center pl-12 hover:bg-grey/20 transitions py-1.5 text-sm relative border-y border-transparent hover:border-grey/20"
										on:click={() => {
											gotoStatusPage();
											showProfileDropdown = false;
										}}
									>
										<span
											class="inset-y-0 absolute left-6 flex items-center justify-center text-blue"
											><Icon
												data={Icons.chargingIcon}
												stroke="transparent"
												class="w-4 h-4"
												color="currentColor"
											/></span
										>
										<span>Status</span>
									</button>
									<button
										type="button"
										role="menuitem"
										tabindex="-1"
										class="text-white/60 hover:text-white group outline-none w-full flex items-center pl-12 hover:bg-grey/20 transitions py-1.5 text-sm relative border-y border-transparent hover:border-grey/20"
										on:click={() => {
											pageUnderDevelopment('Switch Account');
											showProfileDropdown = false;
										}}
									>
										<span
											class="inset-y-0 absolute left-6 flex items-center justify-center text-blue"
											><Icon
												data={Icons.threeCustomersSymbolIcon}
												stroke="transparent"
												class="w-4 h-4"
												color="currentColor"
											/></span
										>
										<span>Switch Account</span>
									</button>
								</div>

								<div class="space-y-1 pb-2" role="none">
									<div class="px-4" role="none">
										<hr class="border-b w-full border-0 border-grey/30" />
									</div>
									<button
										type="button"
										role="menuitem"
										tabindex="-1"
										class="text-white/60 hover:text-white group outline-none w-full flex items-center pl-12 hover:bg-grey/20 transitions py-1.5 text-sm relative border-y border-transparent hover:border-grey/20"
										on:click|preventDefault={async () => {
											await signOut();
											showProfileDropdown = false;
											location.reload();
										}}
									>
										<span
											class="inset-y-0 absolute left-6 flex items-center justify-center text-blue"
											><Icon
												data={Icons.exitIcon}
												stroke="transparent"
												class="w-4 h-4"
												color="currentColor"
											/></span
										>
										<span>Sign out</span>
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</nav>
