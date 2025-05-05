<script lang="ts">
	let {
		type = 'text',
		name = '',
		required = true,
		label,
		value = $bindable()
	} = $props();
</script>

<div class="textfield-group">
	<input class="textfield" bind:value {type} {name} {required} placeholder="" />
	<label for={name} class:required>{label}</label>
</div>

<style>
	@import '$lib/styles/textfield.css';
</style>
