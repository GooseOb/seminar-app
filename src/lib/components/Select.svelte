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
		border: 0.2em solid var(--bg3-color);
		border-radius: 0.5em;
		background-color: var(--bg3-color);
		font-size: 0.9em;
		cursor: pointer;
		appearance: none;
		background-repeat: no-repeat;
		background-position: right 8px center;
		transition: background-color 0.2s;
	}
	select:hover {
		background-color: var(--bg2-color);
	}
</style>
