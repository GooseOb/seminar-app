<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	let { value = $bindable() }: { value: string } = $props();
</script>

<input bind:value class="search" type="text" placeholder={m.search()} />

<style>
	.search {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		background-color: var(--bg2-color);
		border: none;
		outline: none;
	}
	.search:focus {
		box-sizing: border-box;
		border: 1px solid var(--fg-color);
	}
</style>
