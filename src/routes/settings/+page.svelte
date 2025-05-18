<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { switchToLanguage } from '$lib/i18n';
	import {
		availableLanguageTags,
		languageTag,
		type AvailableLanguageTag
	} from '$lib/paraglide/runtime';
	import { themes, type Theme } from '$lib/theme';
	import * as m from '$lib/paraglide/messages.js';
	import MemberCard from '$lib/components/MemberCard.svelte';
	import Input from '$lib/components/Input.svelte';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Success from '$lib/components/Success.svelte';
	import { enhance } from '$app/forms';

	const { data, form } = $props();
	let theme = $state(data.theme);
	const languageOptions = [
		{
			value: 'en',
			displayName: 'English'
		},
		{
			value: 'pl',
			displayName: 'Polski'
		}
	] satisfies {
		value: AvailableLanguageTag;
		displayName: string;
	}[];
	const user = $state(data.user);
</script>

<div>
	<MemberCard
		member={user}
		text={user.role === 'lecturer' ? m.lecturer() : ''}
	/>
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
			displayName: m[`theme_${value}`]()
		}))}
	/>
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
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		font-size: 1.25rem;
	}
</style>
