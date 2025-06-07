<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		label,
		onchange = null,
		value = $bindable(),
		options
	}: {
		label: string;
		onchange?: ChangeEventHandler<HTMLSelectElement> | null;
		value: string;
		options: {
			value: string;
			label: string;
		}[];
	} = $props();
</script>

<div class="selector">
	<span>{label}</span>
	<select class="btn2" bind:value {onchange}>
		{#each options as { value, label }}
			<option {value}>{label}</option>
		{/each}
	</select>
</div>

<style>
	.selector {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
	}
	span {
		flex: 1;
		padding: 0.5em;
	}
	select {
		text-align: center;
		flex: 1;
		padding: 0.5em;
		font-size: 0.9em;
		appearance: none;
	}
</style>
