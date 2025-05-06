<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Input from '$lib/components/Input.svelte';

	const { form } = $props();
</script>

<div class="container">
	<form method="POST" use:enhance>
		<h2 class="header">Login</h2>

		<Input type="text" name="login" label="Login / Student number" />
		<PasswordInput />

		<button type="submit" class="btn">Log in</button>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}
	</form>
	<a href="/register">Create a lecturer account</a>
</div>

<style>
	@import '$lib/styles/login-form.css';
</style>
