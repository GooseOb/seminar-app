<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { switchToLanguage } from '$lib/i18n';
	import {
		availableLanguageTags,
		languageTag,
		type AvailableLanguageTag
	} from '$lib/paraglide/runtime';
	import { themes, type Theme } from '$lib/theme';
	import * as m from '$lib/paraglide/messages';
	import MemberCard from '$lib/components/MemberCard.svelte';
	import Input from '$lib/components/Input.svelte';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Success from '$lib/components/Success.svelte';
	import { enhance } from '$app/forms';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { trpc } from '$lib/trpc/client.svelte';
	import FileButton from '$lib/components/FileButton.svelte';

	const { data, form } = $props();
	const user = $state(data.user);
	let theme = $state(data.theme);

	const setImage = async (files: FileList | null) => {
		if (!files) return;

		const { url } = await trpc.user.photoUpload.query();

		const file = files[0];

		fetch(url, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type,
				'Content-Length': file.size.toString()
			}
		}).then(() => {
			trpc.user.confirmPhotoUpload.mutate();
			user.hasPhoto = true;
		});
	};

	const languageOptions = [
		{
			value: 'en',
			label: 'English'
		},
		{
			value: 'pl',
			label: 'Polski'
		}
	] satisfies {
		value: AvailableLanguageTag;
		label: string;
	}[];
</script>

<div class="container">
	<div class="member-card">
		<Dropzone
			ondrop={(e) => {
				setImage(e.dataTransfer!.files);
			}}
		/>
		<MemberCard
			member={user}
			text={user.role === 'lecturer' ? m.lecturer() : ''}
		>
			<FileButton
				class="btn"
				input={{
					hidden: true,
					onchange: (e) => {
						setImage(e.currentTarget.files);
					}
				}}
			>
				{m.updatePhoto()}
			</FileButton>
		</MemberCard>
	</div>
	{#if user.role === 'lecturer'}
		<form
			method="POST"
			use:enhance={() =>
				({ update }) => {
					update({ reset: false });
				}}
		>
			<Input
				type="text"
				name="firstname"
				label={m.firstName()}
				bind:value={user.firstname}
			/>
			<Input
				type="text"
				name="lastname"
				label={m.lastName()}
				bind:value={user.lastname}
			/>
			<Input
				type="text"
				name="login"
				label={m.login()}
				bind:value={user.login}
			/>
			<PasswordInput bind:value={user.password} />

			<button type="submit" class="btn">{m.update()}</button>
			{#if form?.error}
				<div class="error">{form.error}</div>
			{/if}
			<Success value={form?.success}>
				{m.successfullyUpdated()}
			</Success>
		</form>
	{/if}
	<Select
		label={m.language()}
		value={languageTag()}
		onchange={({ currentTarget }) => {
			switchToLanguage(
				currentTarget.value as (typeof availableLanguageTags)[number]
			);
		}}
		options={languageOptions}
	/>
	<Select
		label={m.theme()}
		value={theme}
		onchange={({ currentTarget }) => {
			theme = currentTarget.value as Theme;
			document.cookie = `theme=${theme}; path=/; max-age=31536000;`;
			document.documentElement.className = theme;
		}}
		options={themes.map((value) => ({
			value,
			label: m[`theme_${value}`]()
		}))}
	/>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		font-size: 1.25rem;
	}
	.member-card {
		position: relative;
	}
</style>
