<script lang="ts">
	import { page } from '$app/state';
	import FileCard from '$lib/components/FileCard.svelte';
	import FileList from '$lib/components/FileList.svelte';
	import type { FileData } from '$lib/server/files';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const thesis: FileData[] = $state([]);
	const files = data.files.then((files) =>
		files.filter((file) => {
			if (file.name.startsWith('thesis/')) {
				file.name = file.name.replace('thesis/', '');
				thesis.push(file);
				return false;
			}
			return true;
		})
	);
</script>

<div>
	<FileCard
		file={thesis[0]}
		toggleMenu={() => {}}
		isMenuOpen={false}
		onclick={() => {}}
		buttons={[]}
		active={false}
	/>
</div>
<div>
	<FileList {files} roomId={page.params.id} />
</div>
