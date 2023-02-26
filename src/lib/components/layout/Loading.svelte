<script>
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { onMount } from 'svelte';
	let showLoading = false;
	onMount(() => {
		showLoading = true;
	});
	let controlsLayout = [
		'previousFrame',
		'playpause',
		'stop',
		'nextFrame',
		'progress',
		'frame',
		'loop',
		'spacer',
		'background',
		'snapshot',
		'zoom',
		'info'
	];
</script>

{#if showLoading}
	<LottiePlayer
		src="/loading.json"
		autoplay={true}
		loop={true}
		controls={false}
		renderer="svg"
		background="transparent"
		height={170}
		width={170}
		{controlsLayout}
	/>
{/if}
