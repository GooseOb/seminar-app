<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { switchToLanguage } from '$lib/i18n';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { themes, type Theme } from '$lib/theme';

	const { data } = $props();
	let theme = $state(data.theme);
</script>

<Select
	label="Language"
	value={languageTag()}
	onchange={({ currentTarget }) => {
		switchToLanguage(
			currentTarget.value as (typeof availableLanguageTags)[number]
		);
	}}
	options={availableLanguageTags}
/>
<Select
	label="Theme"
	value={theme}
	onchange={({ currentTarget }) => {
		theme = currentTarget.value as Theme;
		document.cookie = `theme=${theme}; path=/; max-age=31536000;`;
		document.documentElement.className = theme;
	}}
	options={themes}
/>
