<script lang="ts">
	import AddAuthBase from './AddAuthBase.svelte';
	import { GetGoogleAccessToken } from '$lib/services/OAuthService';
	import { Icons } from '$lib/resources/IconResources';
</script>

<AddAuthBase
	name="Google"
	iconString={Icons.googleColoredIcon}
	onClickHandler={GetGoogleAccessToken}
/>
