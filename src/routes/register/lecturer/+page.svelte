<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/form/input.svelte';

	const { form } = $props();
</script>

<div class="container">
	<h2 class="header">Sign up</h2>

	<form method="POST" use:enhance>
		<Input type="text" name="firstname" label="Firstname" />
		<Input type="text" name="lastname" label="Lastname" />
		<hr />
		<Input type="email" name="email" label="Email" />
		<Input type="password" name="password" label="Password" />

		<button type="submit" class="btn">Sign up</button>

		{#if form?.message}
			<div class="error">{form.message}</div>
		{/if}
	</form>
</div>

<style>
	@import '$lib/form/styles.css';
</style>
