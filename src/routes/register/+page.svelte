<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Input from '$lib/components/Input.svelte';
	import * as m from '$lib/paraglide/messages';

	const { form } = $props();
</script>

<div class="container">
	<h2 class="header">{m.signUp()}</h2>

	<form method="POST" use:enhance>
		<Input type="text" name="firstname" label={m.firstName()} />
		<Input type="text" name="lastname" label={m.lastName()} />
		<hr />
		<Input type="login" name="login" label={m.login()} />
		<PasswordInput />

		<button type="submit" class="btn">{m.signUp()}</button>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}
	</form>
	<a href="/login">
		{m.logIn()}
	</a>
</div>

<style>
	@import '$lib/styles/login-form.css';
</style>
