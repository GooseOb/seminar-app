<script lang="ts">
	import type {
		HTMLButtonAttributes,
		HTMLInputAttributes
	} from 'svelte/elements';

	const {
		children,
		input,
		...btnProps
	}: HTMLButtonAttributes & {
		children: any;
		input?: HTMLInputAttributes;
	} = $props();
	let fileInput: HTMLInputElement = $state(null)!;
</script>

<button
	{...btnProps}
	onclick={(e) => {
		e.stopPropagation();
		fileInput.click();
	}}
>
	<input type="file" hidden bind:this={fileInput} {...input} />
	{@render children()}
</button>
