<script lang="ts">
	import PdfView from './PDFView.svelte';
	import Select from './Select.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { src, isOpen = $bindable() }: { src: string; isOpen: boolean } =
		$props();

	let selectedVersion = $state(src);
	let prevVersion = $state(src);

	$effect(() => {
		selectedVersion = src;
		prevVersion = src;
	});

	const versions = [
		{ value: src, displayName: 'Version 1' },
		{ value: src, displayName: 'Version 2' },
		{ value: src, displayName: 'Version 3' }
	];
	const prevVersions = $derived(
		versions.slice(versions.findIndex((v) => v.value === selectedVersion))
	);
</script>

<PdfView {src} bind:isOpen>
	<div>
		<Select
			label={m.compare()}
			bind:value={selectedVersion}
			options={versions}
		/>
		<Select label={m.to()} bind:value={prevVersion} options={prevVersions} />
	</div>
</PdfView>

<style>
	div {
		display: flex;
		text-align: center;
		width: 100%;
		padding: 0 0.5rem;
	}
</style>
