<script>
	import AddAuthBase from './AddAuthBase.svelte';
	import { GetTikTokAccessToken } from '$lib/services/OAuthService';
	import { Icons } from '$lib/resources/IconResources';
</script>

<AddAuthBase name="TikTok" iconString={Icons.tiktokIcon} onClickHandler={GetTikTokAccessToken} />
