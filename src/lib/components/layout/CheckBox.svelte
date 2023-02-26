<script>
	export let label = '';
	export let style = '';
	export let classes = '';
	export let labelClass = '';
	export let id = '';
	export let span = '';
	export let checked = false;
	export let onChange;
</script>

<label class="{classes}" {style} for="{id}"
	>
	<input type="checkbox" class="sr-only peer" id="{id}" on:change={(e) => onChange(e.target.checked)} {checked} />
	<span class="{span}"><span class="{labelClass}">{label}</span></span>
	
</label>
 