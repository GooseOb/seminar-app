<script lang="ts">
	import Input from './Input.svelte';
	import * as m from '$lib/paraglide/messages';

	let {
		value = $bindable(),
		children
	}: {
		children: () => any;
		value: string | number;
	} = $props();
</script>

<div class="input-group">
	<Input
		type="text"
		bind:value
		label={m.studentNumber()}
		name="invitee_number"
	/>

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
