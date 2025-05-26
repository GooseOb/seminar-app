<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		type = 'text',
		name = '',
		required = true,
		label,
		value = $bindable(),
		...props
	}: HTMLInputAttributes & { label: string } = $props();
</script>

<div class="textfield-group">
	<input
		class="textfield"
		bind:value
		{type}
		{name}
		{required}
		placeholder=""
		{...props}
	/>
	<label for={name} class:required>{label}</label>
</div>

<style>
	@import '$lib/styles/textfield.css';
</style>
