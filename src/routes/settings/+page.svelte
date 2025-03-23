<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { switchToLanguage } from '$lib/i18n';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';

	const onLanguageChange = ({ target }: Event) => {
		switchToLanguage((target as HTMLSelectElement).value as (typeof availableLanguageTags)[number]);
	};
</script>

<Select
	label="Language"
	value={languageTag()}
	onchange={onLanguageChange}
	options={availableLanguageTags}
/>
