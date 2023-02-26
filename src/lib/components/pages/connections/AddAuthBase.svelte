<script lang="ts">
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';

	export let onClickHandler: (event: Event) => void;
	export let iconString: string;
	export let name: string;
</script>

<button
	type="button"
	on:click={onClickHandler}
	class="outline-none bg-transparent rounded-md relative before:absolute before:bg-glass before:backdrop-blur-2.5xl p-5 before:rounded-md before:shadow-glass-dropdown before:opacity-30 before:inset-0 space-y-2 flex justify-center items-center hover:before:shadow-glow-blue before:ring-1 before:ring-transparent hover:before:ring-blue before:ease-in-out before:duration-300 ease-in-out duration-300 hover:before:opacity-50"
>
	<div
		class="relative z-10 flex flex-col gap-4 text-center h-40 justify-center items-center shrink-0"
	>
		<div class="w-20 h-20 flex justify-center items-center">
			<Icon data={iconString} stroke="transparent" class="w-20 h-20 " />
		</div>
		<p class="text-white text-base">{name}</p>
	</div>
</button>
