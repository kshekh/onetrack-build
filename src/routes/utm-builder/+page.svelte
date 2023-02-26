<script lang="ts">
	import UtmCard from '../../lib/components/pages/utm/UTMCard.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { hideLoader } from '$lib/helpers/MiscHelpers';
	import { onMount, tick } from 'svelte';
	import type { utmDataItem } from '$lib/types/Types';

	let sources: utmDataItem[] = [
		{
			isExpanded: false,
			isOdd: true,
			logo: Icons.metaLogoIcon,
			name: 'meta',
			text: 'Meta supports the forwarding of dynamic UTM parameters. For example, the name of a campaign is automatically appended to the URL when a user clicks on the ad. The dynamic UTM parameters must be set in Meta for each ad.',
			fromText: 'For Meta, you can copy and paste the following UTM parameters to your ads:',
			utmCode:
				'utm_source=meta&utm_medium=cpc&campaign_id={{campaign.id}}&ad_id={{ad.id}}&adset_id={{adset.id}}&placement={{placement}}&site_source={{site_source_name}}'
		},
		{
			isExpanded: false,
			isOdd: false,
			logo: Icons.googleColoredIcon,
			name: 'google',
			text: 'Google supports the forwarding of dynamic UTM parameters. For example, the name of a campaign is automatically appended to the URL when a user clicks on the ad. The dynamic UTM parameters must be set for each ad in TikTok.',
			fromText: 'For Google, you can copy and paste the following UTM parameters to your ads:',
			utmCode:
				'{lpurl}?utm_source=google&utm_medium={network}&campaign_id={campaignid}&adset_id={adgroupid}&ad_id={creative}&placement={placement}&utm_term={keyword}'
		},
		{
			isExpanded: false,
			isOdd: true,
			logo: Icons.tiktokIcon,
			name: 'tikTok',
			text: 'TikTok supports the forwarding of dynamic UTM parameters. For example, the name of a campaign is automatically appended to the URL when a user clicks on the ad. The dynamic UTM parameters must be set for each ad in TikTok.',
			fromText: 'For TikTok, you can copy and paste the following UTM parameters to your ads:',
			utmCode:
				'utm_source=tiktok&utm_medium=cpc&campaign_id=_CAMPAIGN_ID_&ad_id=_CID_&adset_id=_AID_&placement=_PLACEMENT_&ttclid=__CLICKID__',
			displayUtm:
				'utm_source=tiktok&utm_medium=cpc&campaign_id= _CAMPAIGN_ID_ &ad_id= _CID_ &adset_id= _AID_ &placement= _PLACEMENT_ &ttclid= __CLICKID__ '
		},
		{
			isExpanded: false,
			isOdd: false,
			logo: Icons.snapchatIcon,
			name: 'snapchat',
			text: 'Snapchat supports the forwarding of dynamic UTM parameters. For example, the name of a campaign is automatically appended to the URL when a user clicks on the ad. The dynamic UTM parameters must be set for each ad on Snapchat.',
			fromText: 'For Snapchat, you can copy and paste the following UTM parameters to your ads:',
			utmCode:
				'utm_source=snapchat&utm_medium=cpc&campaign_id={{campaign.id}}&ad_id={{ad.id}}&adset_id={{adSet.id}}'
		}
	];
	onMount(async () => {
		await tick();
		hideLoader();
	});
</script>

<main class="p-0 max-w-screen-xl mx-auto w-full flex flex-col ">
	<div class="gap-y-5 flex-1 flex-col flex">
		<h1 class="text-xl md:text-3xl text-white leading-none font-bold flex gap-1 pt-2">
			UTM Builder
		</h1>

		<!-- Desktop View -->
		<div class="hidden sm:grid sm:grid-cols-2 gap-5">
			<div class="flex flex-col gap-5">
				{#each sources.filter((x) => x.isOdd) as source}
					<UtmCard {source} />
				{/each}
			</div>
			<div class="flex flex-col gap-5">
				{#each sources.filter((x) => !x.isOdd) as source}
					<UtmCard {source} />
				{/each}
			</div>
		</div>

		<!-- Mobile View -->
		<div class="flex flex-col gap-5 sm:hidden ">
			{#each sources as source}
				<UtmCard {source} />
			{/each}
		</div>
	</div>
</main>
