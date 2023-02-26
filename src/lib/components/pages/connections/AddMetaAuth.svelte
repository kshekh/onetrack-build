<script lang="ts">
	import { openModal } from 'svelte-modals';
	import { MetaOAuth } from '$lib/store';
	import { GetFacebookToken } from '$lib/services/OAuthService';
	import { onMount, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import AdAccountModal from './AdAccountSelectionModal.svelte';
	import AddAuthBase from './AddAuthBase.svelte';
	import { Icons } from '$lib/resources/IconResources';

	let endSubscription: Unsubscriber;

	onMount(() => {
		endSubscription = MetaOAuth.subscribe((res) => {
			if (!res) {
				return;
			}
			handleOpen();
		});
	});
	onDestroy(() => {
		if (endSubscription) {
			endSubscription();
		}
	});
	function handleOpen() {
		openModal(AdAccountModal, {});
	}
</script>

<AddAuthBase name="Meta" iconString={Icons.metaLogoIcon} onClickHandler={GetFacebookToken} />
