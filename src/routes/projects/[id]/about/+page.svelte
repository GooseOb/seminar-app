<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import StudentMemberCard from '$lib/components/StudentMemberCard.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import type { PageProps } from './$types';
	import Success from '$lib/components/Success.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { data, form }: PageProps = $props();
</script>

<form
	class="container"
	use:enhance={() =>
		({ update }) => {
			update({ reset: false });
		}}
	method="POST"
>
	{#await data.student then student}
		<StudentMemberCard {student} role={data.role!} />
	{/await}

	{#await data.project then { name, namePl, description, thesis }}
		<Input label={m.nameEn()} name="name_en" value={name} />
		<Input label={m.namePl()} name="name_pl" value={namePl} />
		<Textarea
			label={m.description()}
			name="description"
			value={description}
			required={false}
		/>
		<Textarea
			label={m.thesis()}
			name="thesis"
			value={thesis}
			required={false}
		/>

		<button class="btn" type="submit"> {m.update()} </button>
	{/await}

	<Success value={form?.success}>{m.successfullyUpdated()}</Success>

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
