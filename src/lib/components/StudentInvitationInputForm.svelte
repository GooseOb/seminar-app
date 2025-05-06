<script lang="ts">
	import Input from './Input.svelte';

	let { value = $bindable(), children } = $props();
</script>

<div class="input-group">
	<Input type="text" bind:value label="Student Number" name="invitee_number" />

	<button type="submit" class="btn invite">
		{@render children()}
	</button>
</div>

<style>
	.input-group {
		display: flex;
		gap: 1rem;
	}
	.invite {
		flex: 0.25;
	}
</style>
