<script lang="ts">
	let { name = '', required = true, label, value = $bindable() } = $props();
	const oninput = (e: InputEvent) => {
		const node = e.currentTarget as HTMLTextAreaElement;
		node.style.height = 'auto';
		node.style.height = `${node.scrollHeight - 16}px`;
	};
</script>

<div class="textfield-group">
	<textarea
		class="textfield"
		bind:value
		{oninput}
		{name}
		{required}
		placeholder=""
	>
	</textarea>
	<label for={name} class:required>{label}</label>
</div>

<style>
	@import '$lib/styles/textfield.css';

	.textfield {
		resize: none;
		max-height: 200px;
		overflow: auto;
	}
</style>
