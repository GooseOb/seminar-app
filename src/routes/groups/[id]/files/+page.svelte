<script lang="ts">
	import FileList from '$lib/components/FileList.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<FileList files={data.files} />
