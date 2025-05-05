<script lang="ts">
	const {
		children
	}: {
		children?: () => any;
	} = $props();
</script>

<header class="header">
	{@render children?.()}
	<h1 class="title">Seminarium App</h1>
</header>

<style>
	.header {
		flex-shrink: 0;
		min-height: 60px;
		display: flex;
		align-items: center;
		padding: 0 20px;
		background-color: var(--bg3-color);
	}
	.title {
		margin-left: 20px;
		font-size: 1.5rem;
	}
</style>
