<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import StudentMemberCard from '$lib/components/StudentMemberCard.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import type { PageProps } from './$types';
	import Success from '$lib/components/Success.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { trpc } from '$lib/trpc/client.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';

	const { data, form }: PageProps = $props();

	let error: string | null = $state(null);

	let projectData: Awaited<typeof data.project> | null = $state(null);

	data.project.then((project) => {
		projectData = project;
	});

	const setEditable = (editable: boolean) => {
		trpc.room.project.setEditable
			.mutate({
				roomId: page.params.id,
				editable
			})
			.then(() => {
				projectData.editable = editable;
			})
			.catch((error) => {
				error = error.message;
			});
	};
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

	{#if projectData}
		{@const { name, namePl, description, thesis, editable } = projectData}
		{@const disabled = !editable}
		{#if data.role === 'lecturer'}
			<button
				class="btn"
				type="button"
				onclick={() => {
					setEditable(!editable);
				}}
			>
				{editable ? m.lockEditing() : m.unlockEditing()}
			</button>
		{/if}
		<Input {disabled} label={m.nameEn()} name="name_en" value={name} />
		<Input {disabled} label={m.namePl()} name="name_pl" value={namePl} />
		<Textarea
			{disabled}
			label={m.description()}
			name="description"
			value={description}
			required={false}
		/>
		<Textarea
			{disabled}
			label={m.thesisStatement()}
			name="thesis"
			value={thesis}
			required={false}
		/>

		{#if editable}
			<button class="btn" type="submit"> {m.update()} </button>
		{/if}
	{:else}
		<p>Loading project details...</p>
	{/if}

	<Success value={form?.success}>{m.successfullyUpdated()}</Success>

	{#if form?.error || error}
		<div class="error">
			{form?.error || error}
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
