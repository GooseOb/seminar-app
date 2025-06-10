<script lang="ts">
	import { page } from '$app/state';
	import FileList from '$lib/components/FileList.svelte';
	import Thesis from '$lib/components/Thesis.svelte';
	import type { FileData } from '$lib/server/files';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages';

	const { data }: PageProps = $props();
	let files: null | FileData[] = $state(null);
	let versions: null | FileData[] = $state(null);
	$effect(() => {
		data.files.then((data) => {
			files = data.files;
			versions = data.versions;
		});
	});
</script>

<div class="page">
	{#if versions}
		<Thesis roomId={page.params.id} role={data.role!} bind:versions />
	{:else}
		<p>{m.loadingThesis()}</p>
	{/if}

	{#if files}
		<FileList {files} roomId={page.params.id} />
	{:else}
		<p>{m.loadingFiles()}</p>
	{/if}
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
