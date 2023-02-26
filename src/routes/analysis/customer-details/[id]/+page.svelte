<script>
	import moment from 'moment';
	import Event from '$lib/components/pages/customerEvents/Event.svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import Tab from '$lib/components/layout/Tab.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { onMount } from 'svelte';
	import { CustomerEvents } from '$lib/store';
	import { get } from 'svelte/store';
	import { showLoader, hideLoader } from '$lib/helpers/MiscHelpers';

	export let data;
	let { id } = data;
	let tabItems = ['Events', 'Traits'];
	let activeItem = 'Events';

	const triggerTabChange = (event) => {
		activeItem = event.detail;
	};
	const identities = [
		{
			name: id,
			gender: 'N/A',
			city: 'N/A',
			Telephone: 'N/A',
			email1: 'N/A',
			email2: 'N/A',
			CLV: 'N/A',
			hPurchase: 'N/A',
			lPurchase: 'N/A',
			lastPurchase: 'N/A'
		}
	];
	let userEvents = [];

	const exportTraitsModel = [
		{
			icon: Icons.targetIcon,
			title: 'Coming soon',
			detail: ''
		}
	];

	onMount(() => {
		showLoader('Crafting customer Insights...');
		let events = get(CustomerEvents);
		try {
			if (!events) {
				return;
			}

			userEvents = events.events
				.filter((x) => x.visitorId == id)
				.map((x) => {
					let sbh = '';
					if (x.event == 'technicalData') {
						sbh = x.data.ipv4;
					}
					if (x.event == 'attribution') {
						sbh = x.data.fbp;
					}
					if (x.event == 'pageView') {
						sbh = x.data.info.url;
					}
					if (x.event == 'click') {
						if (x.data.info.link) {
							sbh = x.data.info.link;
						} else if (x.data.pageInfo.url) {
							sbh = x.data.pageInfo.url;
						}
					}
					if (x.event == 'Click') {
					}
					return {
						icon: Icons.targetIcon,
						title: x.event,
						date: moment.unix(x.timestamp / 1000).format('MM/DD/YYYY hh:mm:ss'),
						code: x.visitorId,
						subheading: sbh
					};
				});
		} catch (err) {
			console.error(err);
		} finally {
			hideLoader();
		}
	});
</script>

<main class="px-0.5 space-y-4 flex flex-col flex-1  ">
	<div class="space-y-6">
		<p class="text-sm font-semibold leading-none">
			<a
				href="/analysis/customer-profiles"
				class="text-blue leading-none hover:text-blue-200 ease-in-out duration-300"
				>Back to Customer Overview</a
			>
		</p>
		<div class="space-y-1.5">
			<h2 class="text-xl text-white leading-none font-medium flex gap-1">
				<span>Customer Profile</span>
			</h2>
			<p class="text-xs leading-none">Data of customer profile</p>
		</div>
	</div>

	<div
		class="bg-transparent flex flex-col relative before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 first-letter: after:absolute after:inset-0 after:border-4 after:border-blue after:rounded-3xl after:ease-in-out after:duration-500 px-5 md:px-0 md:py-5 2xl:py-10 flex-1"
	>
		<div
			class="md:grid md:grid-cols-12 relative z-10 flex-1 divide-y-2 md:divide-y-0 md:divide-x-2 divide-blue"
		>
			<div
				class="2xl:pl-10 md:px-5 lg:px-3 2xl:px-5 py-5 md:py-0 space-y-5 2xl:space-y-8 md:col-span-7 xl:col-span-6"
			>
				<div class="flex flex-wrap gap-5 items-center w-full justify-between">
					<div class="flex gap-5 items-center">
						<div
							class="w-16 h-16 overflow-hidden rounded-full flex justify-center items-center text-white relative "
						>
							<!-- #if (user have photo) -->
							<!-- <img
								src="/images/profile-photo.png"
								class="object-cover aspect-square "
								alt="face user"
							/> -->
							<!-- else -->
							<Icon
								data={Icons.avatar}
								class="object-cover aspect-square w-full"
								stroke="transparent"
							/>
							<!-- else end -->
						</div>
						<div class="space-y-2.5">
							<h2 class="2xl:text-lg text-white leading-none font-medium"><span>{id}</span></h2>
							<p class="text-xs leading-none">Email not available</p>
						</div>
					</div>
					<div class="flex justify-end gap-1 items-center 2xl:mr-10">
						<a
							href="/#"
							class="ease-in-out duration-300 hover:bg-blue w-7 h-7 rounded inline-flex justify-center items-center"
							><Icon
								data={Icons.linkedInIcon}
								class="w-4 h-4"
								stroke="transparent"
								color="currentColor"
							/></a
						>
						<a
							href="/#"
							class="ease-in-out duration-300 hover:bg-blue-700 w-7 h-7 rounded inline-flex justify-center items-center"
							><Icon
								data={Icons.metaBlackLogoIcon}
								class="w-4 h-4"
								stroke="transparent"
								color="currentColor"
							/></a
						>
						<a
							href="/#"
							class="ease-in-out duration-300 hover:bg-red w-7 h-7 rounded inline-flex justify-center items-center"
							><Icon
								data={Icons.instagramIcon}
								class="w-4 h-4"
								stroke="transparent"
								color="currentColor"
							/></a
						>
					</div>
				</div>

				<!-- Tabs -->
				<div class="space-y-5">
					<Tab {tabItems} {activeItem} on:tabChange={triggerTabChange} />
					<div
						class="relative space-y-3 scroll-card-profile overflow-auto on-hover-scroll md:pr-2 2xl:pr-4"
					>
						{#if activeItem === 'Events'}
							{#each userEvents as modelData}
								<Event {modelData} />
							{/each}
						{:else}
							{#each exportTraitsModel as modelData}
								<Event {modelData} />
							{/each}
						{/if}
					</div>
				</div>
				<!-- Tabs end -->
			</div>
			<div
				class="md:px-5 lg:px-2 2xl:pr-5 2xl:pl-10 py-5 md:py-0 space-y-5 md:col-span-5 xl:col-span-6 flex flex-col "
			>
				<h3 class="text-xl text-white leading-none font-medium flex gap-1 capitalize">
					<span>identities</span>
				</h3>
				<div
					class="scroll-card-identities overflow-auto on-hover-scroll flex flex-col md:pr-2 2xl:pr-4 flex-1"
				>
					<div class="gap-y-2 text-white flex flex-col justify-between flex-1">
						{#each identities as identify}
							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col ml:grid ml:grid-cols-2 gap-2 ml:items-center py-3 px-6 ml:justify-between relative z-10"
								>
									<div class="flex items-center gap-2 ml:gap-x-3">
										<span class="shirink-0">
											<Icon
												data={Icons.singleManCustomerIcon}
												stroke="transparent"
												class="w-5 h-5"
											/>
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">OneTrack ID</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">{id}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col ml:grid ml:grid-cols-2 gap-2 ml:items-center py-3 px-6 ml:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon
												data={Icons.singleManCustomerIcon}
												stroke="transparent"
												class="w-5 h-5"
											/>
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">Name</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">{id}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col xs:grid xs:grid-cols-2 gap-2 xs:items-center py-3 px-6 xs:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.genderIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">Gender</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">{identify.gender}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col xs:grid xs:grid-cols-2 gap-2 xs:items-center py-3 px-6 xs:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.buildingIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">City</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">{identify.city}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col xs:grid xs:grid-cols-2 gap-2 xs:items-center py-3 px-6 xs:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.telephoneIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">Telephone</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">{identify.Telephone}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col ml:grid ml:grid-cols-2 gap-2 ml:items-start py-3 px-6 ml:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.emailIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">E-Mail</h3>
									</div>
									<div class="space-y-3">
										<p class="truncate text-white/70 font-medium text-sm">{identify.email1}</p>
										<p class="truncate text-white/70 font-medium text-sm">{identify.email2}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col xs:grid xs:grid-cols-2 gap-2 xs:items-center py-3 px-6 xs:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.moneyIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">CLV</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">$50000</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col ml:grid ml:grid-cols-2 gap-2 ml:items-center py-3 px-6 ml:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.moneyIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">
											Highest Purchase
										</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">{identify.hPurchase}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col ml:grid ml:grid-cols-2 gap-2 ml:items-center py-3 px-6 ml:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.moneyIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">
											Lowest Purchase
										</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">{identify.lPurchase}</p>
									</div>
								</div>
							</div>

							<div
								class="relative rounded-3xl before:ease-in-out before:duration-500 before:absolute before:bg-glass before:backdrop-blur-2.5xl before:rounded-3xl before:shadow-glass-dropdown before:opacity-30 before:inset-0 "
							>
								<div
									class="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col ml:grid ml:grid-cols-2 gap-2 ml:items-center py-3 px-6 ml:justify-between relative z-10"
								>
									<div class="flex items-center gap-x-3">
										<span class="shirink-0">
											<Icon data={Icons.moneyIcon} stroke="transparent" class="w-5 h-5" />
										</span>
										<h3 class="font-semibold text-sm 2xl:text-md tracking-wider">Last Purchase</h3>
									</div>
									<div class="space-y-2">
										<p class="truncate text-white/70 font-medium text-sm">
											{identify.lastPurchase}
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
