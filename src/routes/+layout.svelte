<script lang="ts">
	import 'typeface-montserrat/index.css';
	import '../styles.css';
	import '$lib/local-packages/apexCharts/apexcharts.css'
	import SideNav from '$lib/components/layout/SideNav.svelte';
	import { User, LoadingState, Error500, BaseAPILink, FullScreenView } from '$lib/store';
	import { StartApp } from '$lib/services/AuthService';
	import LoadingWithCaption from '$lib/components/layout/LoadingWithCaption.svelte';
	import TopNav from '$lib/components/layout/TopNav.svelte';
	import UserManagementScreen from '$lib/components/userManagement/UserManagementScreen.svelte';
	import { ToastContainer, FlatToast } from 'svelte-toasts';
	import { showLoader } from '$lib/helpers/MiscHelpers';
	import { onMount, onDestroy } from 'svelte';
	import { initHandlers } from '$lib/handlers/initHandlers';
	import { Modals, closeModal } from 'svelte-modals';
	import Error500Page from '$lib/components/layout/500Error.svelte';
	import { SetAPIKey } from '$lib/services/BackendRequestV2';
	import type { EnvSecrets } from '$lib/types/Types';
	import type { User as FirebaseUser } from 'firebase/auth';

	export let data: { secrets: EnvSecrets };

	let user: null | string | FirebaseUser = 'init';
	let refreshAPITokenInterval: null | NodeJS.Timer = null;

	onMount(() => {
		runAuthFlow(data.secrets);
		showLoader('Evaluating auth state...');
		initHandlers();
		User.subscribe((u) => {
			if (u != 'init') {
				user = u;
			}
		});
		window.onbeforeunload = removeTokenRefreshInterval;
	});
	function runAuthFlow(secrets: EnvSecrets) {
		StartApp(secrets.FIREBASE_API_KEY, secrets.FIREBASE_URL);
		BaseAPILink.set(secrets.DATA_SERVICE_URL);
		refreshAPITokenInterval = setInterval(SetAPIKey, 180000);
	}

	onDestroy(removeTokenRefreshInterval);

	function removeTokenRefreshInterval() {
		if (refreshAPITokenInterval) {
			clearInterval(refreshAPITokenInterval);
		}
		return null;
	}
</script>

<div
	class="app overflow-hidden min-h-screen min-w-screen flex bg-color bg-main bg-fixed bg-no-repeat bg-center-center bg-cover text-white"
>
	{#if user == null}
		<UserManagementScreen />
	{:else if $FullScreenView}
		<slot />
	{:else}
		<div class="root flex flex-col flex-1 lg:pl-64 max-w-full pt-14">
			{#if user != null && user != 'init'}
				<TopNav />
			{/if}

			<div
				class="loader flex-1 flex-col py-3 px-2.5 md:p-4 xl:p-7 items-center {$LoadingState.show ==
				true
					? 'flex'
					: 'hidden'}"
			>
				<LoadingWithCaption caption={$LoadingState.caption} />
			</div>
			<div
				class="flex flex-1 flex-col py-3 px-2.5 md:p-4 xl:p-7 {$LoadingState.show == false
					? ''
					: 'hidden'}"
			>
				{#if $Error500}
					<Error500Page />
				{:else}
					<slot />
				{/if}
			</div>
		</div>

		{#if user != null && user != 'init'}
			<SideNav />
		{/if}
	{/if}
	<Modals>
		<div
			slot="backdrop"
			class="backdrop fixed inset-0 bg-black/50 z-50 hidden"
			on:click={closeModal}
		/>
	</Modals>
	<ToastContainer let:data>
		<FlatToast {data} />
	</ToastContainer>
</div>
