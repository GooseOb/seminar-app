<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/form/input.svelte';

	const { form } = $props();
</script>

<div class="container">
	<form method="POST" use:enhance>
		<h2 class="header">Login</h2>

		<Input type="email" name="email" label="Email" />
		<Input type="password" name="password" label="Password" />

		<button type="submit" class="btn">Log in</button>

		{#if form?.message}
			<div class="error">{form.message}</div>
		{/if}
	</form>
	<a href="/register">Create an account</a>
</div>

<style>
	@import '$lib/form/styles.css';
</style>
