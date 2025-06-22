<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Input from '$lib/components/Input.svelte';
	import * as m from '$lib/paraglide/messages';

	const { form } = $props();
</script>

<div class="container">
	<form method="POST" use:enhance>
		<h2 class="header">Login</h2>

		<Input
			type="text"
			name="login"
			label={m.login() + ' / ' + m.studentNumber()}
		/>
		<PasswordInput />

		<button type="submit" class="btn">{m.logIn()}</button>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}
	</form>
	<a href="/register">
		{m.goSignUp()}
	</a>
</div>

<style>
	@import '$lib/styles/login-form.css';
</style>
