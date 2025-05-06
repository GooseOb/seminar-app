<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Input from '$lib/components/Input.svelte';

	const { form } = $props();
</script>

<div class="container">
	<h2 class="header">Sign up</h2>

	<form method="POST" use:enhance>
		<Input type="text" name="firstname" label="Firstname" />
		<Input type="text" name="lastname" label="Lastname" />
		<hr />
		<Input type="login" name="login" label="Login" />
		<PasswordInput />

		<button type="submit" class="btn">Sign up</button>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}
	</form>
</div>

<style>
	@import '$lib/styles/login-form.css';
</style>
