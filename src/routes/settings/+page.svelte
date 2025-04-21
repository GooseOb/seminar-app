<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { switchToLanguage } from '$lib/i18n';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { type Theme, theme, themes } from '$lib/store/theme.svelte';
</script>

<Select
	label="Language"
	value={languageTag()}
	onchange={({ currentTarget }) => {
		switchToLanguage(currentTarget.value as (typeof availableLanguageTags)[number]);
	}}
	options={availableLanguageTags}
/>
<Select
	label="Theme"
	value={$theme}
	onchange={({ currentTarget }) => {
		theme.set(currentTarget.value as Theme);
	}}
	options={themes}
/>
