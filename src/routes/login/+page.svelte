<script lang="ts">
import { enhance } from '$app/forms';

let { form } = $props();

console.log('Form data:', form);
</script>

<div class="container">
	<form method="POST" use:enhance>
		<h2 class="header">Login</h2>

		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" name="email" required placeholder="Enter your email" />
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" name="password" required placeholder="Enter your password" />
		</div>

		<button type="submit" class="btn">Log in</button>

		{#if form?.message}
			<div class="error">{form.message}</div>
		{/if}
	</form>
	<a href="/register">Create an account</a>
</div>

<style>
	.container {
		font-size: min(4vw, 4vh);
		/* max-width: 400px; */
		padding: 1em;
		gap: 1em;
		/* background-color: var(--bg3-color); */
		border-radius: 0.5em;
		display: flex;
		flex-direction: column;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	h2 {
		text-align: center;
		margin-bottom: 1rem;
		color: var(--fg-color);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		color: var(--fg-color);
		font-size: 0.9em;
		margin-bottom: 0.25em;
	}

	input {
		font-size: 1em;
		padding: 0.5em;
		border-radius: 0.5em;
		background-color: var(--bg2-color);
		color: var(--fg-color);
	}

	input:focus {
		outline: 2px solid var(--primary-color);
	}

	.btn {
		font-size: 1em;
		border-radius: 0.5em;
	}

	.error {
		color: var(--danger-color);
		text-align: center;
	}

	a {
		text-decoration: underline;
		text-align: center;
		transition: color 0.2s;
	}
	a:hover {
		color: var(--primary-color);
	}
</style>
