<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages.js';

	const { form }: PageProps = $props();
</script>

<form class="container" method="POST" use:enhance>
	<Input label={m.nameEn()} name="name_en" />
	<Input label={m.namePl()} name="name_pl" />
	<Textarea label={m.description()} name="description" required={false} />
	<Textarea label={m.thesisStatement()} name="thesis" required={false} />

	<button class="btn" type="submit"> {m.update()} </button>

	{#if form?.error}
		<div class="error">
			{form.error}
		</div>
	{/if}
</form>

<style>
	.container {
		padding: 1rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
