<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import StudentMemberCard from '$lib/components/StudentMemberCard.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import type { PageProps } from './$types';
	import Success from '$lib/components/Success.svelte';

	const { data, form }: PageProps = $props();
	const { name, namePl, description, thesis } = data.project;
</script>

<form
	class="container"
	use:enhance={() =>
		({ update }) => {
			update({ reset: false });
		}}
	method="POST"
>
	<StudentMemberCard student={data.student} role={data.role!} />
	<Input label="Name (English)" name="name_en" value={name} />
	<Input label="Name (Polish)" name="name_pl" value={namePl} />
	<Textarea
		label="Description"
		name="description"
		value={description}
		required={false}
	/>
	<Textarea label="Thesis" name="thesis" value={thesis} required={false} />

	<button class="btn" type="submit"> Update </button>

	<Success value={form?.success}>Successfully updated</Success>

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
