<script>
	import { createEventDispatcher } from 'svelte';
	import { signIn } from '$lib/services/AuthService';
	import {
		showLoginFailToast,
		showLoginSuccessToast,
		showMessage
	} from '$lib/services/ToastService';
	import CheckBox from '$lib/components/layout/CheckBox.svelte';
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';

	const dispatch = createEventDispatcher();

	function gotoSignUp() {
		dispatch('openSignUp', {});
	}

	function gotoPasswordReset() {
		dispatch('openPasswordReset', {});
	}

	async function handleSubmit() {
		let email = document.getElementById('email').value;
		let password = document.getElementById('password').value;
		let user = await signIn(email, password);
		if (user) {
			let username = user.displayName ?? user.email;
			showLoginSuccessToast(`Welcome ${username}, to your OneTrack dashboard`);
		} else {
			showLoginFailToast('Your email address or password is not correct');
		}
	}
</script>

<form class="pt-2" on:submit|preventDefault={handleSubmit}>
	<div class="space-y-7">
		<!-- <p class="text-sm text-grey-2 font-semibold">
			Don’t have an account? <button
				on:click={gotoSignUp}
				class="font-bold text-sm text-blue hover:text-blue-400 ease-in-out duration-300"
				>Sign up</button
			>
		</p> -->
		<div class="space-y-5">
			<div class="relative">
				<label for="email" class="block text-sm font-medium text-gray-700 sr-only">E-Mail</label>
				<div
					class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl"
				>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="E-Mail"
						autocomplete="email"
						required
						class="border relative border-transparent z-10  ease-in-out duration-500 bg-transparent block w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm py-3 px-4 outline-none leading-none peer h-11 "
					/>
				</div>
			</div>

			<div class="relative">
				<label for="password" class="block text-sm font-medium text-gray-700 sr-only"
					>Password</label
				>
				<div
					class="relative before:rounded-md before:shadow-glass-2 before:absolute before:inset-0 before:bg-dropdown before:opacity-70 before:backdrop-blur-2.5xl"
				>
					<input
						id="password"
						name="password"
						type="password"
						placeholder="Password"
						autocomplete="current-password"
						class="border relative z-10 border-transparent ease-in-out duration-500 bg-transparent block w-full text-left placeholder-white focus:outline-none rounded-md focus:border-blue focus:ring-blue text-sm py-3 px-4 outline-none leading-none peer invalid:border-red invalid:text-red h-11"
					/>
				</div>
			</div>
		</div>

		<div class="flex flex-wrap gap-y-7 items-center justify-between">
			<CheckBox
				labelClass="relative z-10 leading-none"
				id="remember-me"
				span="before:w-5 before:h-5 relative before:border before:border-grey before:rounded-sm block after:left-1.5 after:top-1.5 after:-mt-px after:-ml-px after:absolute after:border-l-2 after:border-b-2 after:border-white after:w-2.5 after:h-1.5 after:-rotate-45 after:block after:opacity-0 peer-checked:after:opacity-100 peer-checked:before:bg-blue-box peer-checked:before:border-blue pl-7 before:absolute before:left-0 "
				label="Remember me"
				classes="relative cursor-pointer text-sm "
			/>

			<div class="text-sm">
				<button
					on:click={gotoPasswordReset}
					class="font-bold text-sm text-blue hover:text-blue-400 ease-in-out duration-300"
					>Forgot password?</button
				>
			</div>

			<div class="flex-1 w-full flex justify-center">
				<button
					type="submit"
					class="relative inline-flex items-center justify-center rounded-md bg-transparent p-4 px-6 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-blue ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-md after:inset-0 after:bg-blue-box after:absolute hover:shadow-glow-blue before:rounded-md before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute min-w-44"
					><span class="relative z-10 leading-none">Sign in</span></button
				>
			</div>
		</div>
	</div>
</form>

<div class="mt-6">
	<div class="relative">
		<div
			class="relative flex justify-center items-center text-sm after:h-px after:block after:bg-grey after:flex-1 after:mt-px before:h-px before:block before:bg-grey before:flex-1 before:mt-px"
		>
			<span class="px-4 font-medium text-grey-2">Or continue with</span>
		</div>
	</div>

	<div class="mt-6 grid grid-cols-3 gap-3">
		<button
			class="relative inline-flex items-center justify-center rounded-full bg-transparent p-3 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-blue ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-blue-box after:absolute hover:shadow-glow-blue before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute "
			on:click={() => {
				showMessage('Login through LinkedIn is currently not available.', '', 'info');
			}}
		>
			<span class="relative z-10 leading-none">
				<span class="sr-only">Sign in with LinkedIn</span>
				<Icon data={Icons.linkedin} class="w-4 h-4" stroke="transparent" />
			</span>
		</button>

		<button
			class="relative inline-flex items-center justify-center rounded-full bg-transparent p-3 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-blue ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-blue-box after:absolute hover:shadow-glow-blue before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute "
			on:click={() => {
				showMessage('Login through Facebook is currently not available.', '', 'info');
			}}
		>
			<span class="relative z-10 leading-none">
				<span class="sr-only">Sign in with Facebook</span>
				<Icon data={Icons.meta} class="w-4 h-4" stroke="transparent" />
			</span>
		</button>

		<button
			class="relative inline-flex items-center justify-center rounded-full bg-transparent p-3 text-sm font-medium text-white shadow-sm hover:border-green hover:text-white ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-red ring-offset-color focus:ring-offset-2 after:ease-in-out after:duration-300 hover:after:opacity-100 after:opacity-0 after:rounded-full after:inset-0 after:bg-ig after:absolute hover:shadow-glow-red before:rounded-full before:ease-in-out before:duration-300 hover:before:opacity-0 before:inset-0 before:border before:border-grey before:absolute "
			on:click={() => {
				showMessage('Login through Instagram is currently not available.', '', 'info');
			}}
		>
			<span class="relative z-10 leading-none">
				<span class="sr-only">Sign in with Instagram</span>
				<Icon data={Icons.instagram} class="w-4 h-4" stroke="transparent" />
			</span>
		</button>
	</div>
</div>
