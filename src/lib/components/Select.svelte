<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	const {
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
			displayName: string;
		}[];
	} = $props();
</script>

<div class="selector">
	<span>{label}</span>
	<select class="btn2" {value} {onchange}>
		{#each options as { value, displayName }}
			<option {value}>{displayName}</option>
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
