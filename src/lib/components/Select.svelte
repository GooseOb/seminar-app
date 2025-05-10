<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	const {
		label,
		onchange,
		value,
		options
	}: {
		label: string;
		onchange: ChangeEventHandler<HTMLSelectElement>;
		value: string;
		options: {
			value: string;
			displayName: string;
		}[];
	} = $props();
</script>

<div class="selector">
	{label}:
	<select {value} {onchange}>
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
	}
	select {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--fg-color);
		border-radius: 4px;
		background-color: var(--bg3-color);
		font-size: 16px;
		cursor: pointer;
		appearance: none;
		background-repeat: no-repeat;
		background-position: right 8px center;
		width: fit-content;
	}
</style>
