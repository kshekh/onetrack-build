<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { hideLoader } from '$lib/helpers/MiscHelpers';
	import Loading from '$lib/components/layout/Loading.svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { User, TiktokConnectorsQue, Workspace } from '$lib/store';
	import {
		GetTikTokAccessTokenAndAdvertisersIds,
		GetTikTokAdvertisersDetails
	} from '$lib/services/OAuthService';

	export let data;

	let unsub;
	let isOpen = true;
	let showError = false;
	let errorMessage = '';
	let errorHeading = '';

	let checkAll = true;
	let accounts = [];
	let accessToken = '';

	onMount(async () => {
		unsub = Workspace.subscribe(async (ws) => {
			try {
				showError = false;
				errorMessage = '';
				errorHeading = '';

				if (!data.auth_code) {
					gotoSourcesPage();
					return;
				}
				let response = await GetTikTokAccessTokenAndAdvertisersIds(data.auth_code);

				if (!response.data) {
					errorHeading = 'No access';
					errorMessage = response.error;
					showError = true;
					return;
				}

				accessToken = response.data.access_token;
				if (response.data.advertiser_ids.length == 0) {
					errorHeading = 'We are Sorry 😔';
					errorMessage = `You don't have any ad-accounts to display.`;
					showError = true;
					return;
				}

				let ids_details = await GetTikTokAdvertisersDetails(
					accessToken,
					response.data.advertiser_ids
				);

				if (ids_details.data) {
					accounts = ids_details.data.list.map((x) => {
						return {
							status: true,
							accessToken: accessToken,
							id: x.advertiser_id,
							name: x.name
						};
					});
				} else {
					errorHeading = 'We are Sorry 😔';
					errorMessage = `Couldn't fetch the details about ad accounts from API.`;
					showError = true;
				}
			} catch (err) {
				console.error(err);
			} finally {
				hideLoader();
			}
		});
	});
	onDestroy(() => {
		if (unsub) {
			unsub();
		}
	});
	function onSave() {
		TiktokConnectorsQue.set(accounts.filter((x) => x.status));
		gotoSourcesPage();
	}

	function changeCheckAll() {
		for (let ac of accounts) {
			if (checkAll) {
				ac.status = false;
			} else {
				ac.status = true;
			}
		}
		accounts = accounts;
	}
	function gotoSourcesPage() {
		goto('/tracking/sources');
	}
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div class="contents">
			{#if !showError}
				<h2>{$User.email}'s TikTok Ads Accounts</h2>
				<h3>Please select your ad-accounts you want to add.</h3>
				<div class="hf">
					<p style="margin-right: 20px;">select all:</p>
					<label class="switch">
						<input type="checkbox" on:change={changeCheckAll} bind:checked={checkAll} />
						<span class="slider round" />
					</label>
				</div>
				<div class="main-wrapper">
					{#if accounts.length > 0}
						{#each accounts as account (account.id)}
							<div class="wrapper-modelData">
								<div class="selection">
									<label class="switch">
										<input type="checkbox" bind:checked={account.status} />
										<span class="slider round" />
									</label>
									<Icon data={Icons.tiktokIcon} width="40" height="40" color="transparent" />
								</div>
								<div class="vf">
									<p>{account.name}</p>
									<p>ID: {account.id}</p>
								</div>
							</div>
						{/each}
					{:else}
						<Loading />
					{/if}
				</div>
				<div class="hf footer">
					<button class="wrapper-btn" type="reset" id="btn" on:click={gotoSourcesPage}>clear</button
					>
					<button class="wrapper-btn save" type="reset" id="btn" on:click={onSave}>save</button>
				</div>
			{:else}
				<div class="vf">
					<h2>{errorHeading}</h2>
					<p>{errorMessage}</p>
					<button
						class="wrapper-btn save"
						style="align-self:center;margin-top:35px;margin-left:0;"
						id="btn-cancel"
						on:click={gotoSourcesPage}>back</button
					>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		pointer-events: none;
	}
	.contents {
		background: #111a2d;
		border-radius: 24px;
		padding: 40px;
		width: 570px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
		@media (max-width: 768px) and (min-width: 480px) {
			width: 450px;
		}
		@media (max-width: 479px) {
			width: 300px;
		}
		h2,
		h3 {
			display: flex;
			justify-content: flex-start;
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 700;
			font-size: 24px;
			line-height: 20px;
			margin-bottom: 10px;
			@media (max-width: 768px) and (min-width: 480px) {
				font-size: 20px;
			}
			@media (max-width: 479px) {
				font-size: 18px;
			}
		}
		h3 {
			font-size: 18px;
		}
	}

	.wrapper-btn {
		margin-left: 0.5rem;
		width: 23%;
		text-transform: capitalize;
		font-family: 'Montserrat';
		font-style: normal;
		font-weight: 600;
		font-size: 14px;
		line-height: 20px;
		text-align: center;
		border: 1px solid var(--text-color-light);
		padding: 0.4rem;
		background-color: transparent;
		cursor: pointer;
		color: var(--text-color);
		border-radius: 1.5rem;
		@media (max-width: 768px) and (min-width: 480px) {
			width: 20%;
			font-size: 13px;
		}
		@media (max-width: 479px) {
			width: 40%;
			font-size: 12px;
		}
	}
	.save {
		border-color: #1087f5;
		background-color: #1087f5;
		box-shadow: 0 0 25px 1px #359cfc;
	}
	.wrapper-modelData {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 15px 32px;
		img {
			@media (max-width: 768px) and (min-width: 480px) {
				width: 35px;
				height: 35px;
			}
			@media (max-width: 479px) {
				width: 20px;
				height: 20px;
			}
		}
		&:hover {
			opacity: 0.8;
		}
	}
	.switch {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 25px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			116.02deg,
			rgba(196, 196, 196, 0.25) 0%,
			rgba(196, 196, 196, 0.1) 100%
		);
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 22px;
		width: 22px;
		left: 2px;
		bottom: 2px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: #2196f3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196f3;
	}

	input:checked + .slider:before {
		transform: translateX(25px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 17px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
	.selection {
		width: 35%;
		min-width: 35%;

		display: flex;
		flex-direction: row;

		align-items: center;
		margin: 10px 30px 10px 0;
		& img {
			margin-left: 30px;
		}
		@media (max-width: 479px) {
			width: 50%;
			margin: 5px 15px 5px 0;
		}
	}
	.footer {
		justify-content: center;
		margin-top: 10px;
	}
	.main-wrapper {
		max-height: 400px;
		overflow-y: auto;
	}
</style>
