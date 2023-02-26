<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { hideLoader } from '$lib/helpers/MiscHelpers';
	import Loading from '$lib/components/layout/Loading.svelte';
	import { GetGoogleAdAccountsList } from '$lib/services/OAuthService';
	import { User, GoogleConnectorsQue } from '$lib/store';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';

	let isOpen = true;
	let showError = false;
	let errorMessage = '';
	let errorHeading = '';
	let userName = null;
	let checkAll = true;
	let accounts = [];
	let accessToken = '';

	onMount(async () => {
		try {
			getAccessToken();
			showError = false;
			errorMessage = '';
			errorHeading = '';

			let response = await GetGoogleAdAccountsList(accessToken);
			if (!response) {
				errorHeading = 'No access';
				errorMessage =
					"Couldn't fetch list of Ad Accounts, this can happen due to in-sufficient access to account stats, kindly try to login again.";
				showError = true;
			}
			if (response.length == 0) {
				errorHeading = 'We are Sorry 😔';
				errorMessage = `You don’t have any ad-accounts to display.`;
				showError = true;
			}
			accounts = response.map((x) => {
				x.status = true;
				x.accessToken = accessToken;
				return x;
			});
		} catch (err) {
			console.error(err);
		} finally {
			hideLoader();
		}
	});
	function getAccessToken() {
		let queryPairs = window.location.href.split('#')[1].split('&');
		for (const query of queryPairs) {
			if (query.includes('access_token')) {
				accessToken = query.split('=')[1];
				break;
			}
		}
	}
	function onSave() {
		GoogleConnectorsQue.set(accounts.filter((x) => x.status));
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
				<h2>{userName || $User.email}'s Google Ads Accounts</h2>
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
									<Icon data={Icons.googleColoredIcon} width="40" height="40" />
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
					<h2 style="align-self:center;">{errorHeading}</h2>
					<p style="text-align: center;">{errorMessage}</p>
					<button
						class="wrapper-btn save"
						style="align-self:center;margin-top:35px;margin-left:0;"
						id="btn-cancel"
						on:click={gotoSourcesPage}>cancel</button
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

	.wrapper-content {
		display: flex;
		justify-content: space-between;
		padding: 39px 32px;
		@media (max-width: 479px) {
			padding: 20px 32px;
		}
		input {
			background-color: transparent;
			color: var(--text-color);
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 600;
			font-size: 14px;
			line-height: 20px;
			border: 1px solid var(--text-color-light);
			border-radius: 0.3rem;
			padding: 5px 8px;
			width: 50%;
			@media (max-width: 479px) {
				width: 52%;
				font-size: 12px;
			}
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
