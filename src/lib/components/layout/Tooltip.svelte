<script lang="ts">
	export let tooltip: boolean | string = false; // prevent blank tooltips
	export let className = ''; // prevent blank tooltips
</script>

<button data-tooltip={tooltip} class={className}>
	<slot />
</button>
